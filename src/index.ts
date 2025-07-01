import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createAgent, deleteAgentById, getAgentById, listAgents, updateAgentById } from "./helpers/agents";
import { CreateAgentInputSchema, DeleteAgentInputSchema, DeleteDatastoreInputSchema, GetDatastoreInputSchema, ListAgentsInputSchema, ListDatastoresInputSchema, UpdateAgentInputSchema } from "./schemas";
import { deleteDatastoreById, getDatastoreById, listDatastores } from "./helpers/datastores";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	async init() {
		/**
		 * AGENT TOOLS
		 */
		this.server.tool(
			'get_agent_by_id',
			'Fetches detailed information about a specific Laburen agent by its unique id or handle. Use this to retrieve the agents metadata, configuration, and available tools. Requires a valid API key for authentication.',
			{ agent_id: z.string().describe('The unique id or handle of the agent') },
			async ({ agent_id }) => {
			  const apiKey = (this as unknown as MyMCP).props?.api_key;
			  try {
				const agent = await getAgentById({ agentId: agent_id, apiKey: apiKey as string, baseUrl: (this.env as any).LABUREN_DASHBOARD_URL });
				return { content: [{ type: 'text', text: `Agent: ${JSON.stringify(agent)}` }] };
			  } catch (err: any) {
				return { content: [{ type: 'text', text: `${err.message}` }] };
			  }
			},
		);
		this.server.tool(
			"update_agent",
			"Updates an existing Laburen agent. Supply agent_id and any of the optional fields you wish to change.",
			UpdateAgentInputSchema.shape,
			async (args) => {
			  const { agent_id, ...fields } = args;          // todos los opcionales
			  const apiKey = (this as any).props?.api_key;   // header key inyectada
			  try {
				const updated = await updateAgentById({
				  agentId: agent_id,
				  data:    fields,
				  apiKey:  apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				});
				return {
				  content: [
					{ type: "text", text: `Agent updated: ${JSON.stringify(updated)}` },
				  ],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			}
		);
		this.server.tool(
			"create_agent",
			"Creates a new Laburen agent. Provide at least a description and any additional optional fields.",
			CreateAgentInputSchema.shape,
			async (fields) => {
			  const apiKey = (this as any).props?.api_key;
			  try {
				const agent = await createAgent({
				  apiKey:  apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				  data:    fields,
				});
				return {
				  content: [
					{ type: "text", text: `Agent created: ${JSON.stringify(agent)}` },
				  ],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			}
		);
		this.server.tool(
			"delete_agent",
			"Deletes an existing Laburen agent by its id or handle. Requires a valid API key.",
			DeleteAgentInputSchema.shape,
			async ({ agent_id }) => {
			  const apiKey = (this as any).props?.api_key;
			  try {
				await deleteAgentById({
				  agentId: agent_id,
				  apiKey:  apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				});
				return {
				  content: [
					{ type: "text", text: `Agent ${agent_id} deleted successfully.` },
				  ],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			}
		);
		this.server.tool(
			"get_agents",
			"Retrieves the list of all Laburen agents for the authenticated organization. Optional pagination with page and limit.",
			ListAgentsInputSchema.shape,
			async ({ page, limit }) => {
			  const apiKey = (this as any).props?.api_key;
			  try {
				const agents = await listAgents({
				  apiKey:  apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				  page,
				  limit,
				});
				return {
				  content: [
					{
					  type: "text",
					  text: JSON.stringify(agents),
					},
				  ],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			}
		);
		/**
		 * DATASTORE TOOLS
		 */
		this.server.tool(
			"get_datastores",
			"Retrieves the list of all datastores in the authenticated organization. Supports optional pagination with page and limit.",
			ListDatastoresInputSchema.shape,
			async ({ page, limit }) => {
			  const apiKey = (this as any).props?.api_key;
			  try {
				const datastores = await listDatastores({
				  apiKey:  apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				  page,
				  limit,
				});
				return {
				  content: [
					{ type: "text", text: JSON.stringify(datastores) },
				  ],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			}
		);
		this.server.tool(
			"get_datastore_by_id",
			"Fetches detailed information about a specific Laburen datastore by its unique id. Requires a valid API key.",
			GetDatastoreInputSchema.shape,
			async ({ datastore_id }) => {
			  const apiKey = (this as any).props?.api_key;
			  try {
				const datastore = await getDatastoreById({
				  datastoreId: datastore_id,
				  apiKey:  apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				});
				return {
				  content: [{ type: "text", text: JSON.stringify(datastore) }],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			},
		);
		this.server.tool(
			"delete_datastore",
			"Deletes a specific Laburen datastore by its unique id. Requires a valid API key.",
			DeleteDatastoreInputSchema.shape,
			async ({ datastore_id }) => {
			  const apiKey = (this as any).props?.api_key;
			  try {
				await deleteDatastoreById({
				  datastoreId: datastore_id,
				  apiKey : apiKey as string,
				  baseUrl: (this.env as any).LABUREN_DASHBOARD_URL,
				});
				return {
				  content: [
					{ type: "text", text: `Datastore ${datastore_id} deleted successfully.` },
				  ],
				};
			  } catch (err: any) {
				return { content: [{ type: "text", text: err.message }] };
			  }
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		// 🔐 Basic header-based authentication
		const providedKey = request.headers.get("Laburen-Api-Key");
		if (!providedKey) {
			return new Response("Unauthorized", { status: 401 });
		}
		console.log('env', env);
		const url = new URL(request.url);

		// --- Inyectamos la API key en las `props` del ExecutionContext ---
		const context: ExecutionContext = Object.assign(Object.create(ctx), ctx, {
			props: {
				...(ctx as any).props,
				api_key: providedKey,
			},
		});
		console.log('context', context);
		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, context);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, context);
		}

		return new Response("Not found", { status: 404 });
	},
};
