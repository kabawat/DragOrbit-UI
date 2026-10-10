"use client";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "../button/Button";

export class AppErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(_error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.props.onError?.(error, errorInfo);
		this.setState({
			error,
			errorInfo,
		});
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null, errorInfo: null });
		if (this.props.onReset) {
			this.props.onReset();
		}
	};

	handleReload = () => {
		this.props.onReload?.();
	};

	handleGoHome = () => {
		this.handleReset();
		this.props.onGoHome?.();
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback(this.state.error, this.handleReset);
			}

			return (
				<div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] p-4">
					<div className="max-w-2xl w-full bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] shadow-xl p-8">
						<div className="text-center mb-6">
							<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<AlertTriangle className="w-10 h-10 text-red-600" />
							</div>
							<h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
								Something went wrong
							</h1>
							<p className="text-[rgb(var(--color-text-secondary))]">
								We encountered an unexpected error. Please try again.
							</p>
						</div>

						{this.props.showDetails && this.state.error && (
							<div className="mb-6 p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))]">
								<details className="text-sm">
									<summary className="cursor-pointer text-[rgb(var(--color-text-secondary))] mb-2 font-medium">
										Error Details (Development Only)
									</summary>
									<pre className="mt-2 text-xs text-red-600 overflow-auto max-h-48">
										{this.state.error.toString()}
										{this.state.errorInfo?.componentStack}
									</pre>
								</details>
							</div>
						)}

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button
								variant="primary"
								onClick={this.handleReset}
								leftIcon={RefreshCw}
							>
								Try Again
							</Button>
							<Button
								variant="outline"
								onClick={this.handleReload}
								leftIcon={RefreshCw}
							>
								Reload Page
							</Button>
							<Button
								variant="outline"
								onClick={this.handleGoHome}
								leftIcon={Home}
							>
								Go to Dashboard
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default AppErrorBoundary;
