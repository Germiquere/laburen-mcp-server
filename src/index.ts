import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAgentById } from "./helpers/agents";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	async init() {
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
