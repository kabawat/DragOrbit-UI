"use client";
import { Building2, FileText } from "lucide-react";

const CompanyDetails = ({ companyDetails }) => {
	if (
		!companyDetails ||
		(!companyDetails.companyName && !companyDetails.gstin)
	) {
		return null;
	}

	return (
		<div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] p-6">
			<div className="flex items-center space-x-3 mb-6">
				<div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-full flex items-center justify-center">
					<Building2 className="w-6 h-6 text-green-500" />
				</div>
				<div>
					<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
						Company Details
					</h2>
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						Business information
					</p>
				</div>
			</div>

			<div className="space-y-6">
				{companyDetails.companyName && (
					<div className="flex items-start space-x-4 pb-4 border-b border-[rgb(var(--color-border-primary))]/30">
						<div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
							<Building2 className="w-5 h-5 text-green-500" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
								Company Name
							</p>
							<p className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
								{companyDetails.companyName}
							</p>
						</div>
					</div>
				)}

				{companyDetails.gstin && (
					<div className="flex items-start space-x-4">
						<div className="flex-shrink-0 w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
							<FileText className="w-5 h-5 text-orange-500" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
								GSTIN
							</p>
							<p className="text-base font-semibold text-[rgb(var(--color-text-primary))] font-mono">
								{companyDetails.gstin}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CompanyDetails;
