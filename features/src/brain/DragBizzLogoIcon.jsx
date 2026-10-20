export function DragBizzLogoIcon({
  className = "w-4 h-4",
  size,
  color = "rgb(var(--color-primary))",
}) {
  return (
    <svg
      viewBox="0 0 228 263"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      role="img"
      aria-label="DragBizz"
    >
      <path
        d="M19.6356 263C17.9667 261.666 25.103 257.903 26.0721 257.269C67.5921 229.974 111.547 205.957 153.886 179.936C180.607 159 175.87 124.987 145.883 109.811C108.005 90.645 57.4828 82.1388 17.847 65.4734C11.0337 62.1415 4.71688 56.7758 2.21647 49.3762C-0.110467 42.4911 -0.493292 14.2747 0.547549 6.52825C0.954315 3.48947 1.93534 2.41872 4.77672 1.2403C39.8842 2.02392 77.3545 -1.43359 112.223 0.713894C136.635 2.21534 153.725 12.0375 173.315 25.2814C187.66 34.9779 209.099 49.6155 217.844 64.295C231.034 86.4458 226.823 105.492 226.829 129.234C226.841 164.353 232.757 190.195 202.507 215.857C185.656 230.154 141.205 263 119.574 263H19.6356Z"
        fill={color}
      />
      <mask
        id="mask0_dragbizz_logo"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="13"
        y="66"
        width="119"
        height="191"
      >
        <path
          d="M55.5387 66.2734L131.999 70.3471L120.229 251.239L13.9648 256.903L55.5387 66.2734Z"
          fill="url(#paint0_linear_dragbizz_logo)"
        />
      </mask>
      <g mask="url(#mask0_dragbizz_logo)">
        <path
          opacity="0.3"
          d="M101.323 253.94L7.30676 222.122C3.85523 218.635 33.2919 194.109 33.6089 188.193L59.1873 124.313C59.6838 114.981 79.2624 97.5444 84.7119 103.042L115.112 138.227C118.563 141.714 120.447 147.361 120.13 153.277L115.243 244.961C114.747 254.293 106.773 259.437 101.323 253.94Z"
          fill={color}
        />
      </g>
      <path
        d="M27.4643 225.689L82.9698 188.506C86.6008 186.071 88.7842 181.986 88.7842 177.613V109.857C88.7842 102.96 81.0916 98.8561 75.3609 102.691L19.8554 139.874C16.2244 142.308 14.041 146.394 14.041 150.767V218.517C14.041 225.42 21.7397 229.524 27.4643 225.689Z"
        fill={color}
      />
      <defs>
        <linearGradient
          id="paint0_linear_dragbizz_logo"
          x1="18.5474"
          y1="171.097"
          x2="126.335"
          y2="176.838"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default DragBizzLogoIcon;

