import api from "../services/api";

export type ChecklistType = "ENTRADA" | "SAIDA";
export type DueRuleType = "OFFSET_DAYS" | "DAY_OF_NEXT_MONTH";

export interface TemplateItem {
  id: string;
  sectionId: string;
  code?: string | null;
  description: string;
  order: number;
  sectorId?: string | null;
  isRequired: boolean;
  dueRuleType?: DueRuleType | null;
  dueRuleParam?: number | null;
}

export interface TemplateSection {
  id: string;
  name: string;
  order: number;
  items?: TemplateItem[];
}

export interface Template {
  id: string;
  name: string;
  type: ChecklistType;
  version: number;
  active: boolean;
  sections?: TemplateSection[];
}

export interface CreateTemplatePayload {
  name: string;
  type: ChecklistType;
}

export interface CreateSectionPayload {
  name: string;
  order: number;
}

export interface UpdateSectionPayload {
  name?: string;
  order?: number;
}

export interface CreateItemPayload {
  sectionId: string;
  code?: string | null;
  description: string;
  order: number;
  sectorId?: string | null;
  isRequired: boolean;
  dueRuleType?: DueRuleType | null;
  dueRuleParam?: number | null;
}

export interface UpdateItemPayload {
  code?: string | null;
  description?: string;
  order?: number;
  sectorId?: string | null;
  isRequired?: boolean;
  dueRuleType?: DueRuleType | null;
  dueRuleParam?: number | null;
}

export const templateRepository = {
  async getDefaultByType(type: ChecklistType): Promise<Template> {
    const { data } = await api.get(`/api/templates/default/by-type/${type}`);
    return data;
  },

  async getAll(): Promise<Template[]> {
    const { data } = await api.get("/api/templates");
    return data;
  },

  async getById(id: string): Promise<Template> {
    const { data } = await api.get(`/api/templates/${id}`);
    return data;
  },

  async create(payload: CreateTemplatePayload): Promise<Template> {
    const { data } = await api.post("/api/templates", payload);
    return data;
  },

  async update(id: string, payload: Partial<CreateTemplatePayload> & Record<string, any>): Promise<Template> {
    const { data } = await api.put(`/api/templates/${id}`, payload);
    return data;
  },

  async createSection(templateId: string, payload: CreateSectionPayload): Promise<TemplateSection> {
    const { data } = await api.post(`/api/templates/${templateId}/sections`, payload);
    return data;
  },

  async updateSection(sectionId: string, payload: UpdateSectionPayload): Promise<TemplateSection> {
    const { data } = await api.put(`/api/templates/sections/${sectionId}`, payload);
    return data;
  },

  async deleteSection(sectionId: string): Promise<void> {
    await api.delete(`/api/templates/sections/${sectionId}`);
  },

  async createItem(templateId: string, payload: CreateItemPayload): Promise<TemplateItem> {
    const { data } = await api.post(`/api/templates/${templateId}/items`, payload);
    return data;
  },

  async updateItem(itemId: string, payload: UpdateItemPayload): Promise<TemplateItem> {
    const { data } = await api.put(`/api/templates/items/${itemId}`, payload);
    return data;
  },

  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/api/templates/items/${itemId}`);
  },
};