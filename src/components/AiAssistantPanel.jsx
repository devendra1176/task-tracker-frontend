import { useEffect, useMemo, useRef, useState } from "react";
import { getTaskSummary, askAiAboutTasks } from "../services/aiService";

const SUGGESTED_PROMPTS = [
    "Which task should I complete first?",
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

    const chatAreaRef = useRef(null);

    const isBusy = isSummaryLoading || isAskLoading;

    const canAsk = useMemo(() => {
        return prompt.trim().length > 0 && !isBusy;
    }, [prompt, isBusy]);

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages, isSummaryLoading, isAskLoading]);

    function handleSuggestedPromptClick(value) {
        setPrompt(value);
        setError("");
    }

    function handleUnauthorized(message) {
        const text = (message || "").toLowerCase();

        if (text.includes("401") || text.includes("unauthorized")) {
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
        if (e) {
            e.preventDefault();
        }

        const trimmedPrompt = prompt.trim();

        if (!trimmedPrompt || isBusy) {
            return;
        }

        try {
            setIsAskLoading(true);
            setError("");

            const userMessage = {
                id: Date.now(),
                type: "user",
                label: "You",
                text: trimmedPrompt,
            };

            setMessages((prev) => [...prev, userMessage]);

            const result = await askAiAboutTasks(trimmedPrompt);
            const text = extractAiText(result);

            const assistantMessage = {
                id: Date.now() + 1,
                type: "assistant",
                label: "AI Response",
                text,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setPrompt("");
        } catch (err) {
            const message = err?.message || "Failed to get AI response.";
            handleUnauthorized(message);
            setError(message);
        } finally {
            setIsAskLoading(false);
        }
    }

    function handlePromptKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (!canAsk) return;

            handleAskAi();
        }
    }

    return (
        <aside className="ai-assistant-panel">
            <div className="ai-assistant-card">
                <div className="ai-assistant-header ai-assistant-header-centered">
                    <span className="ai-assistant-badge">AI Assistant</span>
                    <h2 className="ai-assistant-title">Get personalized tips to stay on track</h2>
                </div>

                <div className="ai-assistant-chat-area" ref={chatAreaRef}>
                    {messages.length === 0 ? (
                        <div className="ai-empty-state">
                            Start by asking about your tasks or tap Summary.
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

                <form className="ai-assistant-form" onSubmit={handleAskAi}>
          <textarea
              id="aiPrompt"
              className="ai-textarea"
              rows="4"
              placeholder="Ask about your tasks..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              disabled={isBusy}
              maxLength={500}
          />

                    <div className="ai-char-count">{prompt.length}/500</div>

                    <div className="ai-button-row">
                        <button
                            type="submit"
                            className="ai-primary-button"
                            disabled={!canAsk}
                        >
                            {isAskLoading ? "Thinking..." : "Ask AI"}
                        </button>

                        <button
                            type="button"
                            className="ai-secondary-button"
                            onClick={handleGenerateSummary}
                            disabled={isBusy}
                        >
                            {isSummaryLoading ? "Thinking..." : "Summary"}
                        </button>
                    </div>
                </form>

                <div className="ai-quick-prompts">
                    <div className="ai-quick-prompts-label">Quick prompts</div>

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
            </div>
        </aside>
    );
}

export default AiAssistantPanel;