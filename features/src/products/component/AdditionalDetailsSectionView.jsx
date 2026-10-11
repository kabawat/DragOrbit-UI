"use client";
import { Plus } from "lucide-react";
export function AdditionalDetailsSectionPresentation({ model }) {
  const {
    Toggle,
    t,
    formData,
    handleFieldChange,
    errors,
    Textarea,
    TagInput,
    Input,
    handleSpecificationChange,
    Button,
    removeSpecification,
    addSpecification,
  } = model;
  return (
    <>
      {/* Show in Catalog - correct place inside Catalog information section */}
      <div className="mb-6">
        <Toggle
          label={t("products.showInCatalog")}
          checked={formData.showInCatalog !== false}
          onChange={(checked) => handleFieldChange("showInCatalog", checked)}
          error={errors.showInCatalog}
          errorMessage={errors.showInCatalog}
        />
      </div>

      {/* Add catalog content (descriptions, features, etc.) */}
      <div className="mb-6">
        <Toggle
          label={t("products.addCatalogContent")}
          checked={formData.content?.isEnabled || false}
          onChange={(checked) => {
            const updatedContent = {
              ...formData.content,
              isEnabled: checked,
            };
            handleFieldChange("content", updatedContent);
          }}
        />
      </div>

      {/* Content Fields - Only show if enabled */}
      {formData.content?.isEnabled && (
        <>
          {/* Short Description */}
          <div className="mb-6">
            <Textarea
              label={t("products.shortDescription")}
              placeholder={t("products.enterShortDescription")}
              value={formData.content?.shortDescription || ""}
              onChange={(value) =>
                handleFieldChange("content.shortDescription", value)
              }
              error={errors.shortDescription}
              errorMessage={errors.shortDescription}
              rows={3}
              showCharCount
              maxLength={200}
            />
          </div>

          {/* Product Features */}
          <div className="mb-6">
            <TagInput
              label={t("products.productFeatures")}
              placeholder={t("products.addKeyFeatures")}
              value={formData.content?.features || []}
              onChange={(value) => handleFieldChange("content.features", value)}
              error={errors.features}
              errorMessage={errors.features}
              maxTags={10}
              maxTagLength={50}
            />
          </div>

          {/* Product Tags */}
          <div className="mb-6">
            <TagInput
              label={t("products.productTags")}
              placeholder={t("products.addTags")}
              value={formData.content?.tags || []}
              onChange={(value) => handleFieldChange("content.tags", value)}
              error={errors.tags}
              errorMessage={errors.tags}
              maxTags={15}
              maxTagLength={30}
            />
          </div>

          {/* Product Specifications */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
              {t("products.productSpecifications")}
            </h4>
            <div className="space-y-3">
              {(formData.content?.specifications || []).map((spec, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))]"
                >
                  <Input
                    placeholder={t("products.specificationName")}
                    value={spec.name || ""}
                    onChange={(value) =>
                      handleSpecificationChange(index, "name", value)
                    }
                  />
                  <Input
                    placeholder={t("products.specificationValue")}
                    value={spec.value || ""}
                    onChange={(value) =>
                      handleSpecificationChange(index, "value", value)
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("products.specificationUnit")}
                      value={spec.unit || ""}
                      onChange={(value) =>
                        handleSpecificationChange(index, "unit", value)
                      }
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addSpecification}
                leftIcon={Plus}
              >
                {t("products.addSpecification")}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
