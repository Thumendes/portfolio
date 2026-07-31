'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconSparkles } from '@tabler/icons-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';

const suggestions = [
  'Qual sua stack favorita?',
  'Que banda você mais escuta?',
  'Me conta sobre o projeto ABPF',
  'Você tá disponível pra trabalhar?',
];

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const submit = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <section id="pergunte" className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Pergunte pra mim</SectionLabel>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl border border-border bg-background overflow-hidden flex flex-col h-[480px]"
      >
        <Conversation>
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                icon={<IconSparkles size={22} />}
                title="Sou um assistente com o contexto da vida do Arthur"
                description="Pergunte sobre carreira, projetos, stack ou gosto musical."
              >
                <div className="flex flex-col items-center gap-3">
                  <IconSparkles size={22} className="text-accent" />
                  <p className="text-[13px] font-medium text-foreground">
                    Sou um assistente com o contexto da vida do Arthur
                  </p>
                  <p className="text-[12px] text-muted max-w-xs">
                    Pergunte sobre carreira, projetos, stack ou gosto musical.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        className="text-[12px] px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </ConversationEmptyState>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, i) =>
                    part.type === 'text' ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={(message) => submit(message.text)}
          className="border-t border-border p-3"
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre mim..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <span className="text-[11px] font-mono text-subtle">
              Respostas geradas por IA, podem conter imprecisões
            </span>
            <PromptInputSubmit status={status} disabled={!input.trim() && status === 'ready'} />
          </PromptInputFooter>
        </PromptInput>
      </motion.div>
    </section>
  );
}
