/* =====================================================================
 *  AGENT & TOOL SCHEMAS ‒ idénticos a @laburen/lib/types/dtos.ts
 * =====================================================================*/
import { z } from "zod";

/* ---------------------------------------------------------------------
 *  ENUMS (valores 1-a-1 con schema.prisma)
 * --------------------------------------------------------------------*/
export const AgentModelNameEnum = z.enum([
  "gpt_3_5_turbo","gpt_3_5_turbo_16k","gpt_4","gpt_4_32k","gpt_4_turbo",
  "gpt_4_turbo_vision","gpt_4o","gpt_4o_mini","gpt_41","gpt_41_mini",
  "gpt_41_nano","claude_3_haiku","claude_3_sonnet","claude_3_opus",
  "mixtral_8x7b","mixtral_8x22b","dolphin_mixtral_8x7b","gpt_o1_mini",
  "gpt_o1","deepseek_r1","claude_3_5_sonnet","claude_3_5_v2_sonnet",
  "claude_3_5_v2_haiku","claude_3_7_sonnet","claude_4_sonnet","nova_pro",
  "mixtral_small","mixtral_large","command_r_plus","llama_3_1_70b",
  "llama_3_2_11b","llama_3_2_90b","llama_3_2_1b","llama_3_2_3b","llama_3_8b",
  "llama_3_3_70b","llama_3_1_8b_instant","llama_4_maverick_17b","deepseek_v3",
  "gpt_o3_mini","gemini_1_5_flash","gemini_2_0_flash","gemini_2_5_flash",
  "gemini_2_5_pro","gemini_2_0_flash_thinking",
  "gemini_2_0_flash_thinking_app","grok_3","grok_3_beta","grok_3_fast_beta",
  "grok_3_mini_beta","grok_3_mini_fast_beta","sonar_deep_research",
  "sonar_pro","sonar","model_route",
]);
export type AgentModelNameEnum = z.infer<typeof AgentModelNameEnum>;

export const PromptTypeEnum = z.enum(["raw", "customer_support"]);
export type PromptTypeEnum = z.infer<typeof PromptTypeEnum>;

export const VisibilityEnum = z.enum(["public", "private"]);
export type VisibilityEnum = z.infer<typeof VisibilityEnum>;

/* ---------------------------------------------------------------------
 *  INTERFACE CONFIG
 * --------------------------------------------------------------------*/
export const InterfaceConfigSchema = z.object({
  displayName:               z.string().optional(),
  primaryColor:              z.string().optional(),
  initialMessage:            z.string().optional(),
  initialMessages:           z.array(z.string()).optional(),
  isInitMessagePopupDisabled:z.boolean().optional(),
  isHumanRequestedDisabled:  z.boolean().optional(),
  isMarkAsResolvedDisabled:  z.boolean().optional(),
  isLeadCaptureDisabled:     z.boolean().optional(),
  isBrandingDisabled:        z.boolean().optional(),
  messageTemplates:          z.array(z.string()).optional(),
  position:                  z.enum(["left","right"]).optional(),
  authorizedDomains:         z.array(z.string()).optional(),
  theme:                     z.enum(["light","dark"]).optional(),
  isBgTransparent:           z.boolean().optional(),
  twitterURL:                z.string().optional(),
  instagramURL:              z.string().optional(),
  youtubeURL:                z.string().optional(),
  tiktokURL:                 z.string().optional(),
  githubURL:                 z.string().optional(),
  websiteURL:                z.string().optional(),
  customCSS:                 z.string().optional(),
  iconUrl:                   z.string().optional(),
  bubbleButtonStyle:         z.any().optional(),
  bubbleIconStyle:           z.any().optional(),
  iconStyle:                 z.any().optional(),
  rateLimit: z.object({
    enabled:           z.boolean().optional(),
    maxQueries:        z.number().optional(),
    interval:          z.number().optional(),
    limitReachedMessage:z.string().optional(),
  }).optional(),
});
export type InterfaceConfigSchema = z.infer<typeof InterfaceConfigSchema>;

/* ---------------------------------------------------------------------
 *  RETRIEVAL & FOLLOW-UP CONFIGS
 * --------------------------------------------------------------------*/
export const RetrievalEvaluationConfigSchema = z.object({
  evaluatorPrompt:       z.string().optional(),
  generateQueryPrompt:   z.string().optional(),
  evaluatorModelName:    AgentModelNameEnum.optional(),
  retrievalRounds:       z.number().optional(),
  evaluationThreshold:   z.number().optional(),
  additionalConfig:      z.record(z.any()).optional(),
  retrievalModelName:    AgentModelNameEnum.optional(),
  generationModelName:   AgentModelNameEnum.optional(),
  fallbackModels:        z.record(z.any()).optional(),
  modelTemperatures:     z.record(z.any()).optional(),
  modelMaxTokens:        z.record(z.any()).optional(),
  enableModelComparison: z.boolean().optional(),
  comparisonModels:      z.record(z.any()).optional(),
});
export type RetrievalEvaluationConfigSchema = z.infer<
  typeof RetrievalEvaluationConfigSchema
>;

export const FollowUpConfigSchema = z.object({
  prompt:             z.string().optional(),
  count:              z.number().optional(),
  followUpDelayHours: z.number().optional(),
  config:             z.record(z.any()).optional(),
});
export type FollowUpConfigSchema = z.infer<typeof FollowUpConfigSchema>;

/* ---------------------------------------------------------------------
 *  TOOL TYPES ENUM
 * --------------------------------------------------------------------*/
export const ToolType = {
  datastore:        "datastore",
  form:             "form",
  connector:        "connector",
  agent:            "agent",
  http:             "http",
  mark_as_resolved: "mark_as_resolved",
  request_human:    "request_human",
  lead_capture:     "lead_capture",
  deep_search:      "deep_search",
  app:              "app",
} as const;
export type ToolType = typeof ToolType[keyof typeof ToolType];

/* ---------------------------------------------------------------------
 *  TOOL SCHEMAS
 * --------------------------------------------------------------------*/
/* base */
const ToolBaseSchema = z.object({
  id:                z.string().cuid().optional(),
  type:              z.nativeEnum(ToolType),
  serviceProviderId: z.string().cuid().optional().nullable(),
  serviceProvider:   z.any().optional(),
  datastore:         z.any().optional(),
  form:              z.any().optional(),
});

/* helper key-value */
const KeyVal = z.object({
  key:            z.string().min(1),
  value:          z.any().optional(),
  isUserProvided: z.boolean().optional(),
  description:    z.string().optional(),
  acceptedValues: z.array(z.string().optional()).optional(), // tolerante
  type:           z.string().optional(),
}).refine((v) => v.isUserProvided || v.value !== undefined, {
  message: "Value is required",
  path: ["value"],
});

/* cada tipo de tool */
const HttpToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.http),
  config: z
    .object({
      url: z
        .string()
        .url()
        .describe(
          "Fully-qualified HTTP(S) endpoint the agent will call. Example: https://api.example.com/resource"
        ),
      name: z
        .string()
        .optional()
        .describe("Human-readable name for the HTTP request or integration."),
      method: z
        .enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
        .default("GET")
        .describe("HTTP method to be used when calling the endpoint."),
      description: z
        .string()
        .min(3)
        .describe(
          "Short summary of what this HTTP call does. Helps the LLM choose the correct tool."
        ),
      withApproval: z
        .boolean()
        .optional()
        .describe(
          "If true, the request requires explicit user approval before execution."
        ),
      headers: z
        .array(KeyVal)
        .optional()
        .describe("Static HTTP headers that will be sent with the request."),
      body: z
        .array(KeyVal)
        .optional()
        .describe(
          "Key-value pairs representing the request body. Ignored for methods without a body (e.g., GET)."
        ),
      queryParameters: z
        .array(KeyVal)
        .optional()
        .describe("Query-string parameters appended to the URL."),
      pathVariables: z
        .array(KeyVal)
        .optional()
        .describe("Dynamic segments to interpolate into the URL path."),
    })
    .describe(
      "HTTP configuration detailing how the agent should perform the request."
    ),
})
  .describe(
    "HTTP tool: lets the agent communicate with external services via RESTful APIs, enabling data retrieval or mutation outside the Laburen ecosystem."
  );

const AppToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.app),
  config: z.object({
    name:         z.string().optional(),
    actionId:     z.string().optional(),
    appId:        z.string().optional(),
    entityId:     z.string().optional(),
    description:  z.string().optional(),
    logo:         z.string().url().optional(),
    withApproval: z.boolean().optional(),
    headers:         z.array(KeyVal).optional(),
    body:            z.array(KeyVal).optional(),
    queryParameters: z.array(KeyVal).optional(),
  }),
});

const LeadCaptureToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.lead_capture),
  config: z.object({
    email:                z.string().email().optional(),
    phoneNumber:          z.string().optional(),
    phoneNumberExtension: z.string().optional(),
    isRequired:           z.boolean().optional(),
    isEmailEnabled:       z.boolean().optional(),
    isPhoneNumberEnabled: z.boolean().optional(),
  }),
});

const DeepSearchToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.deep_search),
  config: z.object({
    name:               z.string().min(1),
    description:        z.string().min(3),
    defaultSearchDepth: z.enum(["standard","deep","comprehensive"]).default("deep"),
    defaultMaxResults:  z.number().min(1).max(20).default(10),
    enableImages:       z.boolean().default(false),
    enableCitations:    z.boolean().default(true),
    defaultLanguage:    z.string().default("español"),
    withApproval:       z.boolean().default(false),
    runInBackground:    z.boolean().default(false),
  }),
});

const DatastoreToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.datastore),
  datastoreId: z.string().optional(),
});

const FormToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.form),
  formId: z.string(),
  config: z.record(z.any()).optional(),
});

const ConnectorToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.connector),
  config: z.any(),
});

const AgentToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.agent),
  config: z.any(),
});

// Mark-as-resolved tool – closes the current conversation.
const MarkAsResolvedToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.mark_as_resolved),
}).describe(
  "Marks the current conversation as resolved once the user's issue is successfully addressed."
);

// Request-human tool – escalates to a human operator.
const RequestHumanToolSchema = ToolBaseSchema.extend({
  type: z.literal(ToolType.request_human),
}).describe(
  "Escalates the conversation to a human agent when the AI cannot provide a satisfactory response."
);

/* unión discriminada final */
export const ToolSchema = z.discriminatedUnion("type", [
  HttpToolSchema,
  AppToolSchema,
  LeadCaptureToolSchema,
  DeepSearchToolSchema,
  DatastoreToolSchema,
  FormToolSchema,
  ConnectorToolSchema,
  AgentToolSchema,
  MarkAsResolvedToolSchema,
  RequestHumanToolSchema,
]);
export type ToolSchema = z.infer<typeof ToolSchema>;

/* ---------------------------------------------------------------------
 *  AGENT INPUT SCHEMAS
 * --------------------------------------------------------------------*/
export const UpdateAgentInputSchema = z.object({
  agent_id:                    z.string(),          // obligatorio para update
  name:                        z.string().optional(),
  description:                 z.string().optional(),
  prompt:                      z.string().nullable().optional(),
  systemPrompt:                z.string().nullable().optional(),
  userPrompt:                  z.string().nullable().optional(),
  modelName:                   AgentModelNameEnum.optional(),
  temperature:                 z.number().optional(),
  iconUrl:                     z.string().nullable().optional(),
  promptType:                  PromptTypeEnum.optional(),
  visibility:                  VisibilityEnum.optional(),
  interfaceConfig:             InterfaceConfigSchema.optional(),
  includeSources:              z.boolean().optional(),
  restrictKnowledge:           z.boolean().optional(),
  useMarkdown:                 z.boolean().optional(),
  useConversationalMode:       z.boolean().optional(),
  useSuperRetrieval:           z.boolean().optional(),
  fragmentEvaluationEnabled:   z.boolean().optional(),
  useContextDataAgents:        z.boolean().optional(),
  useSendEmailOnNewConversation:z.boolean().optional(),
  useContentFilter:            z.boolean().optional(),
  useFollowUp:                 z.boolean().optional(),
  conversationalModePrompt:    z.string().optional(),
  timeBetweenMessages:         z.number().optional(),
  useLanguageDetection:        z.boolean().optional(),
  retrievalEvaluationConfig:   RetrievalEvaluationConfigSchema.optional(),
  followUpConfig:              FollowUpConfigSchema.optional(),
  tools:                       z.array(ToolSchema).optional(),
  handle:                      z.string().max(15).regex(/^[a-zA-Z0-9_]+$/).optional(),
});
export type UpdateAgentInputSchema = z.infer<typeof UpdateAgentInputSchema>;

export const CreateAgentInputSchema = UpdateAgentInputSchema.omit({ agent_id: true }).extend({
  description: z.string().min(1, "Description is required"),
});
export type CreateAgentInputSchema = z.infer<typeof CreateAgentInputSchema>;

export const DeleteAgentInputSchema = z.object({
  agent_id: z.string().describe("Unique id or handle of the agent to delete"),
});
export type DeleteAgentInputSchema = z.infer<typeof DeleteAgentInputSchema>;

export const ListAgentsInputSchema = z.object({
  page:  z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});
export type ListAgentsInputSchema = z.infer<typeof ListAgentsInputSchema>;

export const ListDatastoresInputSchema = z.object({
  page:  z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});
export type ListDatastoresInputSchema = z.infer<
  typeof ListDatastoresInputSchema
>;