"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { FormFieldRow, FormRow } from "@/types/database";
import { PhoneInput, type PhoneValue } from "./phone-input";
import { FileUpload, type UploadedFile } from "./file-upload";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { submitForm } from "@/app/actions/submit-form";
import { CheckCircle2, AlertCircle } from "lucide-react";

type FieldOption = { value: string; label_en: string; label_ar: string };
type FormValues = Record<string, unknown>;

function buildSchema(fields: FormFieldRow[], locale: string) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const requiredMsg = locale === "ar" ? "هذا الحقل مطلوب" : "This field is required";

  for (const field of fields) {
    let schema: z.ZodTypeAny = z.any();

    switch (field.type) {
      case "email":
        schema = z.string().email(locale === "ar" ? "بريد إلكتروني غير صحيح" : "Invalid email");
        break;
      case "url":
        schema = z.string().url(locale === "ar" ? "رابط غير صحيح" : "Invalid URL");
        break;
      case "number":
        schema = z.coerce.number();
        break;
      default:
        schema = z.any();
    }

    if (field.required) {
      if (field.type === "file") {
        schema = z.array(z.unknown()).min(1, requiredMsg);
      } else {
        schema = z
          .unknown()
          .refine(
            (v) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
            requiredMsg
          )
          .and(schema);
      }
    }

    shape[field.name] = schema;
  }

  return z.object(shape).passthrough();
}

export function DynamicForm({
  form,
  fields,
  entityType,
  entityId,
  entityLabel,
}: {
  form: FormRow;
  fields: FormFieldRow[];
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("forms");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const defaultValues: FormValues = {};
  for (const field of fields) {
    if (field.default_value) defaultValues[field.name] = field.default_value;
  }
  if (entityLabel) {
    for (const field of fields) {
      if (["service_of_interest", "course", "job", "service"].includes(field.name)) {
        defaultValues[field.name] = entityLabel;
      }
    }
  }

  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    setStatus("submitting");
    setErrorMsg("");

    const schema = buildSchema(fields, locale);
    const result = schema.safeParse(values);
    if (!result.success) {
      const first = result.error.issues[0];
      setErrorMsg(first?.message ?? t("errorMessage"));
      setStatus("error");
      return;
    }

    // Normalize phone values to their international number
    const normalized: FormValues = { ...values };
    for (const field of fields) {
      if (field.type === "phone" && values[field.name] && typeof values[field.name] === "object") {
        const pv = values[field.name] as PhoneValue;
        normalized[field.name] = {
          countryCode: pv.countryCode,
          dialCode: pv.dialCode,
          nationalNumber: pv.nationalNumber,
          internationalNumber: pv.internationalNumber,
        };
      }
    }

    const res = await submitForm({
      formId: form.id,
      formType: form.type,
      entityType: entityType ?? null,
      entityId: entityId ?? null,
      values: normalized,
      website: "",
    });

    if (res.ok) {
      setStatus("success");
      reset();
    } else {
      setErrorMsg(res.error ?? t("errorMessage"));
      setStatus("error");
    }
  }

  function label(field: FormFieldRow) {
    return locale === "ar" ? field.label_ar : field.label_en;
  }
  function placeholder(field: FormFieldRow) {
    return locale === "ar" ? field.placeholder_ar ?? "" : field.placeholder_en ?? "";
  }
  function options(field: FormFieldRow): FieldOption[] {
    if (!field.options) return [];
    return Array.isArray(field.options) ? (field.options as FieldOption[]) : [];
  }

  if (status === "success") {
    const successMsg =
      locale === "ar" ? form.success_message_ar : form.success_message_en;
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="text-lg font-semibold text-emerald-800">{t("successTitle")}</h3>
        <p className="text-sm text-emerald-700">{successMsg || t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const width = field.width === "half" ? "sm:col-span-1" : "sm:col-span-2";
          const fieldLabel = label(field);

          if (field.type === "textarea") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={4}
                  className="input"
                  placeholder={placeholder(field)}
                  {...register(field.name)}
                />
              </div>
            );
          }

          if (field.type === "phone") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <PhoneInput
                      value={f.value as PhoneValue | null}
                      onChange={(v) => f.onChange(v)}
                    />
                  )}
                />
              </div>
            );
          }

          if (field.type === "file") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <FileUpload
                      value={f.value as UploadedFile[] | null}
                      onChange={(v) => f.onChange(v)}
                      accept={
                        (field.validation as { allowedTypes?: string[] } | null)?.allowedTypes
                          ?.map((x) => `.${x}`)
                          .join(",") ?? ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      }
                      maxSizeMB={
                        (field.validation as { maxSizeMB?: number } | null)?.maxSizeMB ?? 10
                      }
                      multiple={field.type === "file" && field.name === "additional_documents"}
                    />
                  )}
                />
              </div>
            );
          }

          if (field.type === "country") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select className="input" {...register(field.name)}>
                  <option value="">{t("chooseOption")}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select className="input" {...register(field.name)}>
                  <option value="">{t("chooseOption")}</option>
                  {options(field).map((o) => (
                    <option key={o.value} value={o.value}>
                      {locale === "ar" ? o.label_ar : o.label_en}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "radio") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-4 pt-1">
                  {options(field).map((o) => (
                    <label key={o.value} className="flex items-center gap-2 text-sm text-charcoal-700">
                      <input
                        type="radio"
                        value={o.value}
                        {...register(field.name)}
                        className="h-4 w-4 text-brand-600"
                      />
                      {locale === "ar" ? o.label_ar : o.label_en}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          if (field.type === "multiselect") {
            return (
              <div key={field.id} className={width}>
                <label className="label">
                  {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-4 pt-1">
                  {options(field).map((o) => (
                    <label key={o.value} className="flex items-center gap-2 text-sm text-charcoal-700">
                      <input
                        type="checkbox"
                        value={o.value}
                        {...register(field.name)}
                        className="h-4 w-4 rounded text-brand-600"
                      />
                      {locale === "ar" ? o.label_ar : o.label_en}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          if (field.type === "checkbox") {
            return (
              <div key={field.id} className={width}>
                <label className="flex items-center gap-2 text-sm text-charcoal-700">
                  <input
                    type="checkbox"
                    {...register(field.name)}
                    className="h-4 w-4 rounded text-brand-600"
                  />
                  {fieldLabel}
                </label>
              </div>
            );
          }

          const inputType =
            field.type === "number"
              ? "number"
              : field.type === "date"
                ? "date"
                : field.type === "time"
                  ? "time"
                  : field.type === "url"
                    ? "url"
                    : field.type === "email"
                      ? "email"
                      : "text";

          return (
            <div key={field.id} className={width}>
              <label className="label">
                {fieldLabel} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={inputType}
                className="input"
                placeholder={placeholder(field)}
                {...register(field.name)}
              />
            </div>
          );
        })}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      {status === "error" && errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Button type="submit" loading={status === "submitting"} className="w-full sm:w-auto">
        {t("submit")}
      </Button>
    </form>
  );
}
