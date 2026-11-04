"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_LANGUAGE = "hi-IN";
const DEFAULT_VAD_THRESHOLD = 0.02;
const DEFAULT_SPEECH_START_FRAMES = 3;
const DEFAULT_SILENCE_TIMEOUT_MS = 900;

export const VOICE_CAPTURE_ERRORS = Object.freeze({
  UNSUPPORTED: "unsupported",
  INSECURE_CONTEXT: "insecure_context",
  PERMISSION_DENIED: "permission_denied",
  NOT_FOUND: "not_found",
  DEVICE_BUSY: "device_busy",
  RECOGNITION_ERROR: "recognition_error",
  NETWORK: "network",
  UNKNOWN: "unknown",
});

const AUDIO_CONSTRAINTS = Object.freeze({
  audio: {
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
});

const isBrowser = () => typeof window !== "undefined";

const isSecureMediaContext = () => {
  if (!isBrowser()) return false;
  return window.isSecureContext === true;
};

const getSpeechRecognitionConstructor = () => {
  if (!isBrowser()) return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const detectCapabilities = () => {
  if (!isBrowser()) {
    return {
      isMicrophoneSupported: false,
      isSpeechRecognitionSupported: false,
      isSupported: false,
    };
  }

  const isMicrophoneSupported = Boolean(navigator.mediaDevices?.getUserMedia);
  const isSpeechRecognitionSupported = Boolean(
    getSpeechRecognitionConstructor()
  );

  return {
    isMicrophoneSupported,
    isSpeechRecognitionSupported,
    isSupported: isMicrophoneSupported && isSpeechRecognitionSupported,
  };
};

const mapMediaError = (error) => {
  const name = error?.name;

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return VOICE_CAPTURE_ERRORS.PERMISSION_DENIED;
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return VOICE_CAPTURE_ERRORS.NOT_FOUND;
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return VOICE_CAPTURE_ERRORS.DEVICE_BUSY;
  }
  if (name === "SecurityError") {
    return VOICE_CAPTURE_ERRORS.INSECURE_CONTEXT;
  }

  return VOICE_CAPTURE_ERRORS.UNKNOWN;
};

const mapRecognitionError = (error) => {
  const code = error?.error;

  if (code === "not-allowed") return VOICE_CAPTURE_ERRORS.PERMISSION_DENIED;
  if (code === "service-not-allowed") {
    return VOICE_CAPTURE_ERRORS.PERMISSION_DENIED;
  }
  if (code === "network") return VOICE_CAPTURE_ERRORS.NETWORK;
  if (code === "audio-capture") return VOICE_CAPTURE_ERRORS.NOT_FOUND;
  if (code === "aborted" || code === "no-speech") return null;

  return VOICE_CAPTURE_ERRORS.RECOGNITION_ERROR;
};

const readAppliedAudioSettings = (stream) => {
  const track = stream?.getAudioTracks?.()?.[0];
  if (!track?.getSettings) {
    return {
      echoCancellation: null,
      noiseSuppression: null,
      autoGainControl: null,
      channelCount: null,
      sampleRate: null,
      deviceId: null,
    };
  }

  const settings = track.getSettings();
  return {
    echoCancellation: settings.echoCancellation ?? null,
    noiseSuppression: settings.noiseSuppression ?? null,
    autoGainControl: settings.autoGainControl ?? null,
    channelCount: settings.channelCount ?? null,
    sampleRate: settings.sampleRate ?? null,
    deviceId: settings.deviceId ?? null,
  };
};

const computeRmsLevel = (analyser, dataBuffer) => {
  analyser.getByteTimeDomainData(dataBuffer);

  let sumSquares = 0;
  for (let i = 0; i < dataBuffer.length; i += 1) {
    const normalized = (dataBuffer[i] - 128) / 128;
    sumSquares += normalized * normalized;
  }

  return Math.sqrt(sumSquares / dataBuffer.length);
};

/**
 * Owns microphone access, browser audio constraints, client VAD, and Browser STT.
 * Does not call backend APIs or own UI.
 */
export function useVoiceCapture({
  language = DEFAULT_LANGUAGE,
  continuous = true,
  interimResults = true,
  vadThreshold = DEFAULT_VAD_THRESHOLD,
  speechStartFrames = DEFAULT_SPEECH_START_FRAMES,
  silenceTimeoutMs = DEFAULT_SILENCE_TIMEOUT_MS,
  onTranscript,
  onSpeechStart,
  onSpeechEnd,
  onError,
} = {}) {
  const [capabilities] = useState(detectCapabilities);
  const [permissionState, setPermissionState] = useState("prompt");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [audioSettings, setAudioSettings] = useState(null);

  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const dataBufferRef = useRef(null);
  const rafRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const speechFrameCountRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const shouldListenRef = useRef(false);
  const startingRef = useRef(false);
  const mountedRef = useRef(true);
  const finalTranscriptRef = useRef("");

  const onTranscriptRef = useRef(onTranscript);
  const onSpeechStartRef = useRef(onSpeechStart);
  const onSpeechEndRef = useRef(onSpeechEnd);
  const onErrorRef = useRef(onError);
  const optionsRef = useRef({
    language,
    continuous,
    interimResults,
    vadThreshold,
    speechStartFrames,
    silenceTimeoutMs,
  });

  onTranscriptRef.current = onTranscript;
  onSpeechStartRef.current = onSpeechStart;
  onSpeechEndRef.current = onSpeechEnd;
  onErrorRef.current = onError;
  optionsRef.current = {
    language,
    continuous,
    interimResults,
    vadThreshold,
    speechStartFrames,
    silenceTimeoutMs,
  };

  const emitError = useCallback((code, cause) => {
    if (!code || !mountedRef.current) return;

    const nextError = { code, cause: cause?.message || cause || null };
    setError(nextError);
    onErrorRef.current?.(nextError);

    if (code === VOICE_CAPTURE_ERRORS.PERMISSION_DENIED) {
      setPermissionState("denied");
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const setSpeakingState = useCallback((nextSpeaking) => {
    if (isSpeakingRef.current === nextSpeaking) return;

    isSpeakingRef.current = nextSpeaking;
    if (mountedRef.current) setIsSpeaking(nextSpeaking);

    if (nextSpeaking) onSpeechStartRef.current?.();
    else onSpeechEndRef.current?.();
  }, []);

  const stopVadLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clearSilenceTimer();
    speechFrameCountRef.current = 0;
    setSpeakingState(false);
    if (mountedRef.current) setAudioLevel(0);
  }, [clearSilenceTimer, setSpeakingState]);

  const disconnectAudioGraph = useCallback(() => {
    stopVadLoop();

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // already disconnected
      }
      sourceNodeRef.current = null;
    }

    analyserRef.current = null;
    dataBufferRef.current = null;

    if (audioContextRef.current) {
      const context = audioContextRef.current;
      audioContextRef.current = null;
      context.close().catch(() => {});
    }
  }, [stopVadLoop]);

  const stopMediaStream = useCallback(() => {
    if (!streamRef.current) return;

    for (const track of streamRef.current.getTracks()) {
      track.stop();
    }
    streamRef.current = null;
  }, []);

  const detachRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;

    try {
      recognition.stop();
    } catch {
      // already stopped
    }

    try {
      recognition.abort();
    } catch {
      // already aborted
    }

    recognitionRef.current = null;
  }, []);

  const cleanupResources = useCallback(() => {
    shouldListenRef.current = false;
    startingRef.current = false;
    isListeningRef.current = false;

    detachRecognition();
    disconnectAudioGraph();
    stopMediaStream();

    if (mountedRef.current) {
      setIsListening(false);
      setInterimTranscript("");
    }
  }, [detachRecognition, disconnectAudioGraph, stopMediaStream]);

  const startVadLoop = useCallback(() => {
    const analyser = analyserRef.current;
    const dataBuffer = dataBufferRef.current;
    if (!analyser || !dataBuffer) return;

    const tick = () => {
      if (!shouldListenRef.current || !analyserRef.current) return;

      const {
        vadThreshold: threshold,
        speechStartFrames: startFrames,
        silenceTimeoutMs: silenceMs,
      } = optionsRef.current;

      const level = computeRmsLevel(analyser, dataBuffer);
      if (mountedRef.current) setAudioLevel(level);

      if (level >= threshold) {
        speechFrameCountRef.current += 1;
        clearSilenceTimer();

        if (
          !isSpeakingRef.current &&
          speechFrameCountRef.current >= startFrames
        ) {
          setSpeakingState(true);
        }
      } else {
        speechFrameCountRef.current = 0;

        if (isSpeakingRef.current && !silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            silenceTimerRef.current = null;
            if (shouldListenRef.current) setSpeakingState(false);
          }, silenceMs);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [clearSilenceTimer, setSpeakingState]);

  const setupAudioGraph = useCallback(
    async (stream) => {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextCtor();
      const sourceNode = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      sourceNode.connect(analyser);

      audioContextRef.current = audioContext;
      sourceNodeRef.current = sourceNode;
      analyserRef.current = analyser;
      dataBufferRef.current = new Uint8Array(analyser.fftSize);

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      startVadLoop();
    },
    [startVadLoop]
  );

  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      emitError(VOICE_CAPTURE_ERRORS.UNSUPPORTED);
      return false;
    }

    const recognition = new SpeechRecognitionCtor();
    const {
      language: lang,
      continuous: cont,
      interimResults: interim,
    } = optionsRef.current;

    recognition.lang = lang;
    recognition.continuous = cont;
    recognition.interimResults = interim;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimText = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result?.[0]?.transcript?.trim?.() || "";
        if (!text) continue;

        if (result.isFinal) finalChunk += `${text} `;
        else interimText += `${text} `;
      }

      finalChunk = finalChunk.trim();
      interimText = interimText.trim();

      if (finalChunk) {
        const nextFinal = [finalTranscriptRef.current, finalChunk]
          .filter(Boolean)
          .join(" ")
          .trim();
        finalTranscriptRef.current = nextFinal;

        if (mountedRef.current) {
          setTranscript(nextFinal);
          setInterimTranscript("");
        }

        onTranscriptRef.current?.(nextFinal, {
          isFinal: true,
          chunk: finalChunk,
        });
      } else if (mountedRef.current) {
        setInterimTranscript(interimText);
      }

      if (interimText && !finalChunk) {
        onTranscriptRef.current?.(
          [finalTranscriptRef.current, interimText]
            .filter(Boolean)
            .join(" ")
            .trim(),
          { isFinal: false, chunk: interimText }
        );
      }
    };

    recognition.onerror = (event) => {
      const code = mapRecognitionError(event);
      if (code) emitError(code, event);
    };

    recognition.onend = () => {
      if (!shouldListenRef.current || !optionsRef.current.continuous) {
        if (mountedRef.current) setIsListening(false);
        isListeningRef.current = false;
        return;
      }

      try {
        recognition.start();
      } catch {
        // restart race; next user action can recover
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      return true;
    } catch (cause) {
      emitError(VOICE_CAPTURE_ERRORS.RECOGNITION_ERROR, cause);
      return false;
    }
  }, [emitError]);

  const startListening = useCallback(async () => {
    if (startingRef.current || isListeningRef.current) return false;

    setError(null);

    if (!capabilities.isSupported) {
      emitError(VOICE_CAPTURE_ERRORS.UNSUPPORTED);
      return false;
    }

    if (!isSecureMediaContext()) {
      emitError(VOICE_CAPTURE_ERRORS.INSECURE_CONTEXT);
      return false;
    }

    startingRef.current = true;
    shouldListenRef.current = true;

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);

      if (!shouldListenRef.current || !mountedRef.current) {
        for (const track of stream.getTracks()) track.stop();
        startingRef.current = false;
        return false;
      }

      streamRef.current = stream;
      setPermissionState("granted");
      setAudioSettings(readAppliedAudioSettings(stream));

      await setupAudioGraph(stream);

      const recognitionStarted = setupSpeechRecognition();
      if (!recognitionStarted) {
        cleanupResources();
        return false;
      }

      isListeningRef.current = true;
      startingRef.current = false;
      if (mountedRef.current) setIsListening(true);
      return true;
    } catch (cause) {
      startingRef.current = false;
      shouldListenRef.current = false;
      cleanupResources();
      emitError(mapMediaError(cause), cause);
      return false;
    }
  }, [
    capabilities.isSupported,
    cleanupResources,
    emitError,
    setupAudioGraph,
    setupSpeechRecognition,
  ]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;

    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // already stopped
      }
    }

    cleanupResources();
    return finalTranscriptRef.current.trim();
  }, [cleanupResources]);

  const abortListening = useCallback(() => {
    shouldListenRef.current = false;

    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.abort();
      } catch {
        // already aborted
      }
    }

    cleanupResources();
  }, [cleanupResources]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    if (mountedRef.current) {
      setTranscript("");
      setInterimTranscript("");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cleanupResources();
    };
  }, [cleanupResources]);

  useEffect(() => {
    if (!isBrowser() || !navigator.permissions?.query) return undefined;

    let permissionStatus;

    navigator.permissions
      .query({ name: "microphone" })
      .then((status) => {
        permissionStatus = status;
        if (mountedRef.current) setPermissionState(status.state);

        status.onchange = () => {
          if (mountedRef.current) setPermissionState(status.state);
        };
      })
      .catch(() => {
        // Permissions API for microphone is not available in all browsers
      });

    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, []);

  return {
    isSupported: capabilities.isSupported,
    isMicrophoneSupported: capabilities.isMicrophoneSupported,
    isSpeechRecognitionSupported: capabilities.isSpeechRecognitionSupported,
    permissionState,
    isListening,
    isSpeaking,
    audioLevel,
    transcript,
    interimTranscript,
    error,
    audioSettings,
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
  };
}

export default useVoiceCapture;
