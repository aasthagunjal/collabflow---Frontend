import React, { useState } from "react";
import {
  Smile,
  Send,
  Paperclip,
  Code,
  Bold,
  Italic,
  List,
  Link,
  X,
  CornerDownRight,
  Files,
  ChevronRight,
  Plus,
  Users,
  Image,
  FileText,
} from "lucide-react";
import { ChatMessage, Channel, User, Reaction } from "../types";
import { users } from "../data";

interface ChatViewProps {
  channel: Channel;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onSendCodeSnippet?: (filename: string, code: string) => void;
  infoPaneOpen: boolean;
  onToggleInfoPane: () => void;
}

export default function ChatView({
  channel,
  messages,
  onSendMessage,
  onSendCodeSnippet,
  infoPaneOpen,
  onToggleInfoPane,
}: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [codeSnippetFilename, setCodeSnippetFilename] = useState("");
  const [codeSnippetCode, setCodeSnippetCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);

  // Sync with prop messages
  React.useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Handle active emoji reactions clicks (increments count when clicked)
  const handleReactMessage = (msgId: string, emoji: string) => {
    setLocalMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;

        const reactions = msg.reactions || [];
        const reactIdx = reactions.findIndex((r) => r.emoji === emoji);
        let updatedReactions = [...reactions];

        if (reactIdx > -1) {
          const item = updatedReactions[reactIdx];
          const userReacted = !item.userReacted;
          updatedReactions[reactIdx] = {
            ...item,
            count: userReacted ? item.count + 1 : Math.max(0, item.count - 1),
            userReacted,
          };
        } else {
          updatedReactions.push({ emoji, count: 1, userReacted: true });
        }

        return { ...msg, reactions: updatedReactions };
      }),
    );
  };

  const handlePostMessage = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handlePostCodeSnippet = () => {
    if (!codeSnippetFilename.trim() || !codeSnippetCode.trim()) return;
    if (onSendCodeSnippet) {
      onSendCodeSnippet(codeSnippetFilename, codeSnippetCode);
    }
    setCodeSnippetFilename("");
    setCodeSnippetCode("");
    setShowCodeModal(false);
  };

  // Mock Members in channel
  const channelMembers = [
    users.alex,
    users.jordan,
    users.david,
    users.sarahChen,
    users.casey,
    users.elena,
    users.marcus,
  ];

  // Shared Files index
  const sharedFiles = [
    {
      name: "hero_v2_final.png",
      size: "1.2 MB",
      ext: "image",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu27z-Rm7u0BE08bGf-hOA3zKHlAW8Wa_d3PwwnW9E-uc1wnhZyG2IjZrUoJtvRBb5-5NaI8bKhFUlzI6jzXS73_tmBbjnIh737LOk5UVcpqDqPESNCgim6EEgA35WlhWWpdDVM44a3VRhY3ZJdikhpGYSsWwlkJUjQokpFbl8YYlIn4MiTvclLbxYnpeahMFo96EHL2XcfelQ8iTdNqRRs1D2UrsergtDgqgRoTTZZBEw-ByRR5ZPnscuJ29HPG69IxJFBkxX3t0",
    },
    { name: "component_specs.pdf", size: "4.5 MB", ext: "pdf" },
  ];

  return (
    <div className="flex-1 flex h-[calc(100vh-64px)] select-none overflow-hidden animate-fade-in relative">
      {/* Center Chat Core workspace thread */}
      <div className="flex-1 flex flex-col justify-between h-full bg-slate-50 relative">
        {/* Messages scroll section */}
        <div className="flex-1 overflow-y-auto p-lg space-y-lg custom-scrollbar pb-24">
          {/* Historical Date divider - Screen 2 */}
          <div className="flex items-center gap-md select-none justify-center">
            <div className="h-px bg-border-subtle flex-1"></div>
            <span className="font-headline text-[10px] uppercase font-bold text-[#5a5c79] tracking-widest leading-none bg-white border border-border-subtle px-3 py-1 rounded-full">
              October 24, 2023
            </span>
            <div className="h-px bg-border-subtle flex-1"></div>
          </div>

          {/* Map of Chat Messages lists */}
          {localMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-md select-text group relative"
            >
              {/* Sender Avatar badge */}
              <div className="shrink-0 w-9 h-9 rounded-full bg-surface-container overflow-hidden flex items-center justify-center border border-border-subtle font-headline font-bold text-xs select-none">
                {msg.sender.avatar ? (
                  <img
                    src={msg.sender.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover shadow-sm"
                  />
                ) : (
                  <span>{msg.sender.initials}</span>
                )}
              </div>

              {/* Msg Bubble and details */}
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-baseline gap-sm select-none">
                  <span className="font-headline font-extrabold text-[12px] text-on-surface hover:underline cursor-pointer">
                    {msg.sender.name}
                  </span>
                  <span className="font-headline text-[9px] text-[#5a5c79] tnum font-semibold">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs font-sans text-on-surface-variant leading-relaxed mt-[2px] break-words whitespace-pre-wrap select-all">
                  {msg.content}
                </p>

                {/* Inline Image card representation - Screen 2 */}
                {msg.imageUrl && (
                  <div className="mt-md min-w-[300px] max-w-sm rounded-xl overflow-hidden border border-[#c7c4d8] shadow bg-white relative">                    <img
                    src={msg.imageUrl}
                    alt="Attached Visual mockup preview"
                    className="w-full object-cover max-h-55"
                  />
                    <div className="p-xs bg-white flex items-center justify-between border-t border-border-subtle select-none">
                      <div className="flex items-center gap-sm">
                        <Files className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-on-surface leading-tight">
                            hero_v2_final.png
                          </p>
                          <p className="text-[8px] text-outline">
                            1.2 MB • Image asset
                          </p>
                        </div>
                      </div>
                      <a
                        href={msg.imageUrl}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="p-1 hover:bg-[#eff4ff] rounded text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Inline Code Card snippet wrapper - Screen 2 */}
                {msg.codeSnippet && (
                  <div className="mt-md w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-[11px] shadow-lg leading-relaxed text-slate-300">
                    <div className="bg-slate-900 border-b border-slate-800 px-md py-xs flex justify-between items-center select-none">
                      <div className="flex items-center gap-sm">
                        <Code className="w-3.5 h-3.5 text-primary-container shrink-0" />
                        <span className="text-[10px] font-semibold text-slate-400">
                          {msg.codeSnippet.filename}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            msg.codeSnippet?.code || "",
                          );
                          alert("Code snipped copied to clipboard!");
                        }}
                        className="text-[9px] font-bold text-slate-500 hover:text-white px-md py-1 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded transition-all"
                      >
                        Copy Block
                      </button>
                    </div>
                    <pre className="p-md overflow-x-auto text-slate-200">
                      {msg.codeSnippet.code}
                    </pre>
                  </div>
                )}

                {/* Reaction pill elements */}
                <div className="flex flex-wrap gap-xs mt-sm select-none">
                  {msg.reactions?.map((react, rIdx) => (
                    <button
                      key={rIdx}
                      onClick={() => handleReactMessage(msg.id, react.emoji)}
                      className={`inline-flex items-center gap-xs px-2 py-[2px] rounded-full border text-[10px] font-bold transition-all active:scale-95 cursor-pointer ${react.userReacted
                        ? "bg-[#dfe0ff] border-primary text-[#4744e5]"
                        : "bg-white border-border-subtle text-secondary hover:border-primary-container"
                        }`}
                    >
                      <span>{react.emoji}</span>
                      <span>{react.count}</span>
                    </button>
                  ))}

                  {/* Quick Add Reaction Hover trigger */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-2 select-none flex items-center bg-white border border-border-subtle rounded-lg shadow-sm p-[2px] gap-1 z-10">
                    {["🚀", "🙌", "🔥", "👀"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReactMessage(msg.id, emoji)}
                        className="p-1 hover:bg-[#eff4ff] rounded transition-all text-sm hover:scale-115 active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Simulated Live User typing indicator */}
          <div className="flex items-center gap-sm select-none p-sm bg-white/40 border border-[#e1dfff] border-dashed rounded-xl max-w-sm animate-pulse">
            <div
              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
            <span className="text-[10px] font-headline font-bold text-primary uppercase tracking-wider pl-1">
              Sarah Chen is typing design specs...
            </span>
          </div>
        </div>

        {/* Message Input composer area */}
        <div className="absolute bottom-md left-md right-md select-none bg-white border border-[#c7c4d8] rounded-2xl p-sm shadow-md flex flex-col gap-sm">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePostMessage();
              }
            }}
            placeholder={`Message #${channel.name}...`}
            className="w-full bg-transparent border-none border-0 text-xs font-sans outline-none resize-none min-h-[48px] p-2 focus:ring-0 placeholder:text-outline"
          />

          {/* Composer bottom formatting tray */}
          <div className="flex justify-between items-center border-t border-border-subtle pt-sm">
            <div className="flex items-center gap-sm">
              <button
                onClick={() => setInputText((prev) => prev + " **bold**")}
                className="p-1.5 hover:bg-[#eff4ff] text-secondary hover:text-primary rounded-lg active:scale-95 transition-all"
                title="Bold font"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setInputText((prev) => prev + " *italic*")}
                className="p-1.5 hover:bg-[#eff4ff] text-secondary hover:text-primary rounded-lg active:scale-95 transition-all"
                title="Italic font"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCodeModal(true)}
                className="p-1.5 hover:bg-[#eff4ff] text-secondary hover:text-primary rounded-lg active:scale-95 transition-all"
                title="Code block"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => setInputText((prev) => prev + "\n- Item ")}
                className="p-1.5 hover:bg-[#eff4ff] text-secondary hover:text-primary rounded-lg active:scale-95 transition-all"
                title="Bullet lists"
              >
                <List className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-border-subtle mx-xs"></div>

              <button
                onClick={() => alert("Upload dialog initialized.")}
                className="p-1.5 hover:bg-[#eff4ff] text-secondary hover:text-primary rounded-lg active:scale-95 transition-all"
                title="Add attachment"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-md">
              <button
                onClick={() => setInputText((prev) => prev + " 🚀")}
                className="p-1.5 hover:bg-[#eff4ff] text-[#f59e0b] rounded-lg active:scale-95 transition-all"
                title="Add reactions"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={handlePostMessage}
                disabled={!inputText.trim()}
                className={`p-1.5 rounded-xl flex items-center justify-center transition-all ${inputText.trim()
                  ? "bg-primary hover:bg-opacity-90 text-white shadow shadow-primary/20 cursor-pointer active:scale-95"
                  : "bg-surface-container text-outline cursor-not-allowed"
                  }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Pane Details Drawer (Screen 2 Right Side Information Panel) */}
      {infoPaneOpen && (
        <aside
          id="chat-details-panel"
          className="w-[300px] border-l border-border-subtle bg-white h-full flex flex-col justify-start shrink-0 overflow-y-auto p-lg gap-lg shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-sm border-b border-border-subtle select-none">
            <h3 className="font-headline font-bold text-sm text-on-surface">
              About
            </h3>
            <button
              onClick={onToggleInfoPane}
              className="p-1 rounded-full text-secondary hover:bg-surface-container-low transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Topics info */}
          <div className="space-y-xs">
            <span className="font-headline text-[10px] text-outline font-extrabold uppercase tracking-wider block">
              Topic
            </span>
            <p className="text-xs font-sans text-on-surface-variant leading-relaxed select-text p-sm bg-bg-slate-50 border border-border-subtle rounded-lg">
              Discussing frontend architecture, layout standards, and component
              handovers for sprint cycles.
            </p>
          </div>

          {/* Members in Channel list */}
          <div className="space-y-sm select-all">
            <div className="flex items-center justify-between">
              <span className="font-headline text-[10px] text-outline font-extrabold uppercase tracking-wider block">
                Channel Members
              </span>
              <span className="bg-surface-container text-[#5a5c79] font-extrabold text-[10px] px-2 py-0.5 rounded">
                {channelMembers.length}
              </span>
            </div>

            <div className="space-y-sm pb-md max-h-[220px] overflow-y-auto custom-scrollbar select-none">
              {channelMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-sm">
                  <div className="w-7 h-7 rounded-full bg-surface-container border border-border-subtle overflow-hidden flex items-center justify-center font-bold text-[10px] shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt="Roster"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{member.initials}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-on-surface truncate leading-tight">
                      {member.name}
                    </p>
                    <p className="text-[9px] text-[#555a79] truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Files category - Screen 2 */}
          <div className="space-y-sm border-t border-border-subtle pt-md select-none">
            <span className="font-headline text-[10px] text-outline font-extrabold uppercase tracking-wider block">
              Shared Assets
            </span>

            <div className="space-y-sm">
              {sharedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-sm border border-border-subtle rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                  onClick={() => f.url && window.open(f.url, "_blank")}
                >
                  <div className="flex items-center gap-sm">
                    {f.ext === "image" ? (
                      <Image className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-warning-amber shrink-0" />
                    )}
                    <div>
                      <p className="text-[11px] font-bold text-on-surface leading-tight transition-colors group-hover:text-primary max-w-[150px] truncate">
                        {f.name}
                      </p>
                      <p className="text-[8px] text-outline">
                        {f.size} • {f.ext.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Code snippet creator modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm shadow z-[70] flex items-center justify-center">
          <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-[500px] p-lg shadow-2xl animate-scale-up space-y-md">
            <div className="flex items-center justify-between border-b border-border-subtle pb-xs">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Share Code Snippet
              </h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1 rounded-full text-secondary hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-sm">
              <div>
                <label className="text-[10px] font-bold text-secondary uppercase block mb-xs">
                  Filename
                </label>
                <input
                  type="text"
                  value={codeSnippetFilename}
                  onChange={(e) => setCodeSnippetFilename(e.target.value)}
                  placeholder="e.g. tailwind.config.ts"
                  className="w-full bg-bg-slate-50 border border-[#c7c4d8] rounded-xl py-sm px-md text-xs font-sans outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-secondary uppercase block mb-xs">
                  Code Content
                </label>
                <textarea
                  value={codeSnippetCode}
                  onChange={(e) => setCodeSnippetCode(e.target.value)}
                  placeholder="type your code here..."
                  className="w-full bg-bg-slate-50 border border-[#c7c4d8] rounded-xl p-md text-xs font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[160px] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-sm border-t border-border-subtle pt-sm">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-md py-1.5 border border-border-subtle rounded-xl text-xs font-headline font-semibold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePostCodeSnippet}
                className="px-md py-1.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-headline font-bold"
              >
                Post Code Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
