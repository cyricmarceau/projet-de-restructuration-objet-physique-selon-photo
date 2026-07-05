import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Tu es un expert en design d'intérieur et en aménagement. On te fournit la photo d'une pièce, et tu dois donner des conseils concrets et actionnables pour l'améliorer.

Structure ta réponse en sections courtes avec des titres en gras (utilise **titre**) :
- Observations : ce que tu vois dans la pièce (style actuel, éléments dominants, éclairage, agencement)
- Points forts : ce qui fonctionne bien et qu'il vaut mieux garder
- À améliorer : 3 à 6 recommandations spécifiques et faisables — chacune expliquée en 1-2 phrases avec le "pourquoi"
- Idées bonus : 1 ou 2 suggestions plus créatives ou ambitieuses (facultatives)

Ton conseil doit être pragmatique : privilégie ce qui coûte peu ou rien (réarranger, désencombrer, changer un éclairage, ajouter une plante) avant les gros travaux. Reste concret ("déplacer le canapé face à la fenêtre" plutôt que "revoir la circulation"). Écris directement au tutoiement, sans préambule.`;

const MODEL = "claude-opus-4-8";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Aucune image reçue." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const mediaType = file.type;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mediaType)) {
      return new Response(
        JSON.stringify({ error: `Format non supporté : ${mediaType}. Utilise JPEG, PNG, WEBP ou GIF.` }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.byteLength > 8 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Image trop lourde (max 8 Mo)." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const base64 = buffer.toString("base64");

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY manquante côté serveur." }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    }

    const client = new Anthropic();

    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
                data: base64,
              },
            },
            {
              type: "text",
              text: "Voici la photo de la pièce. Donne-moi tes conseils pour l'améliorer.",
            },
          ],
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Erreur inconnue";
          controller.enqueue(encoder.encode(`\n\n[Erreur : ${message}]`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
