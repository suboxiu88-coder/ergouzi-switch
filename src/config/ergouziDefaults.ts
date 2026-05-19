export const ERGOUZI_ROOT_URL = "https://ergouzi.life";
export const ERGOUZI_OPENAI_BASE_URL = `${ERGOUZI_ROOT_URL}/v1`;
export const ERGOUZI_ANTHROPIC_BASE_URL = ERGOUZI_ROOT_URL;
export const ERGOUZI_GEMINI_BASE_URL = ERGOUZI_ROOT_URL;
export const ERGOUZI_DEFAULT_MODEL = "gpt-5.4";
export const ERGOUZI_CODEX_PROVIDER = "ergouzi";

export const ERGOUZI_CODEX_CONFIG = `model_provider = "${ERGOUZI_CODEX_PROVIDER}"
model = "${ERGOUZI_DEFAULT_MODEL}"

[model_providers.${ERGOUZI_CODEX_PROVIDER}]
name = "${ERGOUZI_CODEX_PROVIDER}"
base_url = "${ERGOUZI_OPENAI_BASE_URL}"
wire_api = "responses"
requires_openai_auth = true`;
