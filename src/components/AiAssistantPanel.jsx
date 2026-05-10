import { useMemo, useState } from "react";
import { getTaskSummary, askAiAboutTasks } from "../services/aiService";

const SUGGESTED_PROMPTS = [
    "Which task should I complete first?",
    "Summarize my pending tasks.",
    "How can I plan today?",
];

function extractAiText(result) {
    return result?.data || "";
}

function AiAssistantPanel({ onUnauthorized }) {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [isAskLoading, setIsAskLoading] = useState(false);

    const isBusy = isSummaryLoading || isAskLoading;

    const canAsk = useMemo(() => {
        return prompt.trim().length > 0 && !isBusy;
    }, [prompt, isBusy]);

    function handleSuggestedPromptClick(value) {
        setPrompt(value);
        setError("");
    }

    function handleUnauthorized(message) {
        if (
            message.toLowerCase().includes("401") ||
            message.toLowerCase().includes("unauthorized")
        ) {
            onUnauthorized?.();
        }
    }

    async function handleGenerateSummary() {
        try {
            setIsSummaryLoading(true);
            setError("");

            const result = await getTaskSummary();
            const text = extractAiText(result);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: "assistant",
                    label: "Summary",
                    text,
                },
            ]);
        } catch (err) {
            const message = err?.message || "Failed to generate AI summary.";
            handleUnauthorized(message);
            setError(message);
        } finally {
            setIsSummaryLoading(false);
        }
    }

    async function handleAskAi(e) {
        e.preventDefault();

        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            setError("Please enter a question for AI.");
            return;
        }

        try {
            setIsAskLoading(true);
            setError("");

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: "user",
                    label: "You",
                    text: trimmedPrompt,
                },
            ]);

            const result = await askAiAboutTasks(trimmedPrompt);
            const text = extractAiText(result);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "assistant",
                    label: "AI Response",
                    text,
                },
            ]);

            setPrompt("");
        } catch (err) {
            const message = err?.message || "Failed to get AI response.";
            handleUnauthorized(message);
            setError(message);
        } finally {
            setIsAskLoading(false);
        }
    }

    return (
        <aside className="ai-assistant-panel">
            <div className="ai-assistant-card">
                <div className="ai-assistant-header">
                    <span className="ai-assistant-badge">AI Assistant</span>
                    <h2 className="ai-assistant-title">Task guidance</h2>
                    <p className="ai-assistant-subtitle">
                        Ask questions about your tasks or generate a quick summary.
                    </p>
                </div>

                <div className="ai-assistant-chat-area">
                    {messages.length === 0 ? (
                        <div className="ai-empty-state">
                            No AI output yet. Generate a summary or ask a question.
                        </div>
                    ) : (
                        messages.map((item) => (
                            <div
                                key={item.id}
                                className={`ai-message-card ai-message-${item.type}`}
                            >
                                <div className="ai-response-label">{item.label}</div>
                                <p className="ai-response-text">{item.text}</p>
                            </div>
                        ))
                    )}
                </div>

                {error && <div className="message message-error">{error}</div>}

                <div className="ai-assistant-bottom">
                    <div className="ai-assistant-section">
                        <button
                            type="button"
                            className="ai-primary-button ai-full-button"
                            onClick={handleGenerateSummary}
                            disabled={isBusy}
                        >
                            {isSummaryLoading ? "Thinking..." : "Generate Task Summary"}
                        </button>
                    </div>

                    <div className="ai-assistant-section">
                        <div className="ai-suggested-prompts">
                            {SUGGESTED_PROMPTS.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className="ai-prompt-chip"
                                    onClick={() => handleSuggestedPromptClick(item)}
                                    disabled={isBusy}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form className="ai-assistant-form" onSubmit={handleAskAi}>
                        <label htmlFor="aiPrompt" className="ai-label">
                            Ask AI about your tasks
                        </label>

                        <textarea
                            id="aiPrompt"
                            className="ai-textarea"
                            rows="4"
                            placeholder="Ask something like: Which task should I complete first?"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isBusy}
                            maxLength={500}
                        />

                        <div className="ai-form-footer">
                            <span className="ai-char-count">{prompt.length}/500</span>

                            <button
                                type="submit"
                                className="ai-primary-button"
                                disabled={!canAsk}
                            >
                                {isAskLoading ? "Thinking..." : "Ask AI"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </aside>
    );
}

export default AiAssistantPanel;