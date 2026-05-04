import { useState, useCallback } from "react";
import {
  templateRepository,
  ChecklistType,
  Template,
  CreateTemplatePayload,
  CreateSectionPayload,
  UpdateSectionPayload,
  CreateItemPayload,
  UpdateItemPayload,
} from "../repository/template.repository";

export function useTemplate() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [defaultTemplate, setDefaultTemplate] = useState<Template | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.getAll();
      setTemplates(data);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao carregar templates");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTemplateById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.getById(id);
      setSelectedTemplate(data);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao carregar template");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDefaultTemplate = useCallback(async (type: ChecklistType) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.getDefaultByType(type);
      setDefaultTemplate(data);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao carregar template padrão");
      setDefaultTemplate(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (payload: CreateTemplatePayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.create(payload);
      setTemplates((prev) => [...prev, data]);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao criar template");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.update(id, payload);

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? data : t))
      );

      if (selectedTemplate?.id === id) {
        setSelectedTemplate(data);
      }

      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao atualizar template");
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  const addSection = useCallback(async (templateId: string, payload: CreateSectionPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.createSection(templateId, payload);
      await loadTemplateById(templateId);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao criar seção");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadTemplateById]);

  const editSection = useCallback(async (templateId: string, sectionId: string, payload: UpdateSectionPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.updateSection(sectionId, payload);
      await loadTemplateById(templateId);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao atualizar seção");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadTemplateById]);

  const removeSection = useCallback(async (templateId: string, sectionId: string) => {
    setLoading(true);
    setError(null);

    try {
      await templateRepository.deleteSection(sectionId);
      await loadTemplateById(templateId);
      return true;
    } catch (e: any) {
      setError(e.message || "Erro ao excluir seção");
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadTemplateById]);

  const addItem = useCallback(async (templateId: string, payload: CreateItemPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.createItem(templateId, payload);
      await loadTemplateById(templateId);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao criar item");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadTemplateById]);

  const editItem = useCallback(async (templateId: string, itemId: string, payload: UpdateItemPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await templateRepository.updateItem(itemId, payload);
      await loadTemplateById(templateId);
      return data;
    } catch (e: any) {
      setError(e.message || "Erro ao atualizar item");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadTemplateById]);

  const removeItem = useCallback(async (templateId: string, itemId: string) => {
    setLoading(true);
    setError(null);

    try {
      await templateRepository.deleteItem(itemId);
      await loadTemplateById(templateId);
      return true;
    } catch (e: any) {
      setError(e.message || "Erro ao excluir item");
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadTemplateById]);

  return {
    templates,
    defaultTemplate,
    selectedTemplate,
    loading,
    error,

    loadTemplates,
    loadTemplateById,
    loadDefaultTemplate,
    createTemplate,
    updateTemplate,
    addSection,
    editSection,
    removeSection,
    addItem,
    editItem,
    removeItem,
    setLoading
  };
}