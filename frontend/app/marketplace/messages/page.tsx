"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import VerifyExchangeModal from "@/components/modals/VerifyExchangeModal";
import ReviewModal from "@/components/modals/ReviewModal";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Package, 
  ArrowLeft, 
  Loader2, 
  Check, 
  CheckCheck, 
  ExternalLink,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Star,
  CheckCircle2,
  Handshake,
  Copy
} from "lucide-react";

interface OtherUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  university: string | null;
}

interface ContextDetails {
  id: number;
  title: string;
  price?: string;
  image?: string | null;
  status?: string;
  type: string;
}

interface LatestMessage {
  id: number;
  content: string;
  timestamp: string;
  sender: number;
  is_read: boolean;
}

interface Conversation {
  id: number;
  buyer: number;
  seller: number;
  buyer_email: string;
  seller_email: string;
  other_user: OtherUser;
  context_details: ContextDetails | null;
  context_object_str: string | null;
  unread_count: number;
  latest_message: LatestMessage | null;
  updated_at: string;
}

interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_email?: string;
  sender_name: string;
  sender_avatar: string | null;
  content: string;
  is_read: boolean;
  timestamp: string;
}

interface TransactionData {
  id: number;
  seller: number;
  seller_email: string;
  seller_name: string;
  seller_avatar: string | null;
  buyer: number;
  buyer_email: string;
  buyer_name: string;
  buyer_avatar: string | null;
  listing: number;
  listing_title: string;
  listing_image: string | null;
  agreed_price: string;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  seller_verified: boolean;
  buyer_verified: boolean;
  i_verified: boolean;
  other_party_verified: boolean;
  my_otp: string | null;
  has_reviewed: boolean;
  created_at: string;
  completed_at: string | null;
}

function MessagesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const conversationParam = searchParams.get("conversation");
  const sellerParam = searchParams.get("seller");
  const listingParam = searchParams.get("listing");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Layer 5: Exchange & Review States
  const [activeTransaction, setActiveTransaction] = useState<TransactionData | null>(null);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [isInitiatingTrade, setIsInitiatingTrade] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch all conversations
  const fetchConversations = async (selectId?: number) => {
    try {
      const res = await api.get("/api/messaging/conversations/");
      const data: Conversation[] = res.data.results || res.data;
      setConversations(data);

      if (selectId) {
        const found = data.find(c => c.id === selectId);
        if (found) {
          setSelectedConversation(found);
          setShowMobileChat(true);
        }
      } else if (!selectedConversation && data.length > 0 && !conversationParam) {
        if (window.innerWidth >= 768) {
          setSelectedConversation(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async (conversationId: number, isInitial = false) => {
    if (isInitial) setIsLoadingMessages(true);
    try {
      const res = await api.get(`/api/messaging/conversations/${conversationId}/messages/`);
      const data: Message[] = res.data;
      setMessages(data);
      if (isInitial) {
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      if (isInitial) setIsLoadingMessages(false);
    }
  };

  // Fetch transaction context for current conversation
  const fetchTransactionContext = async () => {
    if (!selectedConversation?.context_details?.id) {
      setActiveTransaction(null);
      return;
    }

    try {
      setIsLoadingTransaction(true);
      const res = await api.get(`/api/transactions/for_context/?listing_id=${selectedConversation.context_details.id}&other_user_id=${selectedConversation.other_user.id}`);
      setActiveTransaction(res.data);
    } catch (err) {
      console.error("Failed to load transaction context", err);
    } finally {
      setIsLoadingTransaction(false);
    }
  };

  // Initial load and URL param handling
  useEffect(() => {
    const init = async () => {
      if (sellerParam) {
        try {
          const res = await api.post("/api/messaging/conversations/", {
            seller: sellerParam,
            listing: listingParam || undefined
          });
          const newConv: Conversation = res.data;
          await fetchConversations(newConv.id);
          setSelectedConversation(newConv);
          setShowMobileChat(true);
          return;
        } catch (err) {
          console.error("Failed to init conversation from params", err);
        }
      }

      const targetId = conversationParam ? parseInt(conversationParam, 10) : undefined;
      await fetchConversations(targetId);
    };

    init();
  }, [conversationParam, sellerParam, listingParam]);

  // Load messages and transaction whenever selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id, true);
      fetchTransactionContext();
    }
  }, [selectedConversation?.id]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversation && document.visibilityState === "visible") {
        fetchMessages(selectedConversation.id, false);
        fetchTransactionContext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversation || isSending) return;

    const content = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    try {
      const res = await api.post(`/api/messaging/conversations/${selectedConversation.id}/messages/`, {
        content
      });

      setMessages(prev => [...prev, res.data]);
      setTimeout(scrollToBottom, 50);

      // Update sidebar preview
      setConversations(prev => prev.map(c => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            latest_message: {
              id: res.data.id,
              content: res.data.content,
              timestamp: res.data.timestamp,
              sender: res.data.sender,
              is_read: false
            }
          };
        }
        return c;
      }));
    } catch (err) {
      console.error("Failed to send message", err);
      setInputMessage(content); // restore on error
    } finally {
      setIsSending(false);
    }
  };

  // Initiate Trade
  const handleInitiateTrade = async () => {
    if (!selectedConversation?.context_details?.id || isInitiatingTrade) return;
    setIsInitiatingTrade(true);

    try {
      const isSeller = selectedConversation.seller === user?.id || (user?.email && selectedConversation.seller_email === user.email);
      const res = await api.post("/api/transactions/", {
        listing: selectedConversation.context_details.id,
        buyer: isSeller ? selectedConversation.other_user.id : undefined,
        agreed_price: selectedConversation.context_details.price || "0"
      });

      setActiveTransaction(res.data);
      await fetchTransactionContext();
      
      const priceStr = selectedConversation.context_details.price 
        ? `₹${parseFloat(selectedConversation.context_details.price).toLocaleString('en-IN')}` 
        : "";

      await api.post(`/api/messaging/conversations/${selectedConversation.id}/messages/`, {
        content: `🤝 Initiated safe on-campus trade${priceStr ? ` for ${priceStr}` : ""}. Verify 6-digit exchange codes when meeting in person to confirm!`
      });
      fetchMessages(selectedConversation.id, false);
    } catch (err) {
      console.error("Failed to initiate trade", err);
    } finally {
      setIsInitiatingTrade(false);
    }
  };

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const filteredConversations = conversations.filter(c => 
    c.other_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.other_user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.context_details?.title && c.context_details.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-surface-container border-2 border-outline-variant/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-140px)] min-h-[580px] animate-fade-in-up">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-outline-variant/20 flex flex-col bg-surface-container ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}>
          {/* Inbox Search Bar */}
          <div className="p-4 border-b border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Messages
              </h2>
              <span className="text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-full border border-outline-variant/30">
                {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
            {isLoadingConversations ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm font-bold text-on-surface">No conversations yet</p>
                <p className="text-xs text-on-surface-variant">
                  Browse the marketplace feed and click "Message Seller" to start chatting!
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConversation?.id === conv.id;
                const latest = conv.latest_message;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      setShowMobileChat(true);
                      router.replace(`/marketplace/messages?conversation=${conv.id}`, { scroll: false });
                    }}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors hover:bg-surface-container-highest/60 cursor-pointer ${
                      isSelected ? "bg-surface-container-highest border-l-4 border-primary" : ""
                    }`}
                  >
                    {/* User Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-outline-variant/30">
                        {conv.other_user.avatar ? (
                          <img src={conv.other_user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black font-black text-[10px] rounded-full flex items-center justify-center border-2 border-surface-container">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>

                    {/* Chat Preview Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-sm text-on-surface truncate">
                          {conv.other_user.name}
                        </h4>
                        {latest && (
                          <span className="text-[10px] text-on-surface-variant font-medium shrink-0">
                            {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {/* Linked context item badge */}
                      {conv.context_details && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-outline-variant/20 text-[10px] font-bold text-primary mb-1 max-w-full truncate">
                          <Package className="w-3 h-3 shrink-0" />
                          <span className="truncate">{conv.context_details.title}</span>
                          {conv.context_details.price && (
                            <span className="text-on-surface ml-0.5 font-bold">₹{parseFloat(conv.context_details.price).toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      )}

                      {/* Latest message snippet */}
                      <p className={`text-xs truncate ${conv.unread_count > 0 ? "font-bold text-on-surface" : "text-on-surface-variant font-medium"}`}>
                        {latest ? latest.content : "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className={`flex-1 flex flex-col bg-surface ${
          !showMobileChat ? "hidden md:flex" : "flex"
        }`}>
          {selectedConversation ? (
            <>
              {/* Chat Top Header */}
              <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-surface-container-highest text-on-surface"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <Link
                    href={`/marketplace/users/${selectedConversation.other_user.id}`}
                    className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-outline-variant/30 shrink-0 group-hover:scale-105 transition-transform">
                      {selectedConversation.other_user.avatar ? (
                        <img src={selectedConversation.other_user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5 group-hover:text-primary transition-colors">
                        {selectedConversation.other_user.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      </h3>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {selectedConversation.other_user.university || "Verified Campus Peer"}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Linked context card quick view */}
                {selectedConversation.context_details && (
                  <Link
                    href={`/marketplace/listings/${selectedConversation.context_details.id}`}
                    className="flex items-center gap-3 p-1.5 pr-3 bg-surface hover:bg-surface-container-highest border border-outline-variant/30 rounded-xl transition-all group"
                  >
                    {selectedConversation.context_details.image ? (
                      <img
                        src={selectedConversation.context_details.image}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-[11px] font-bold text-on-surface group-hover:text-primary transition-colors max-w-[120px] truncate">
                        {selectedConversation.context_details.title}
                      </p>
                      {selectedConversation.context_details.price && (
                        <p className="text-[10px] font-black text-primary font-['Space_Grotesk']">
                          ₹{parseFloat(selectedConversation.context_details.price).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary shrink-0" />
                  </Link>
                )}
              </div>

              {/* Layer 5: Interactive On-Campus Exchange Banner */}
              {selectedConversation.context_details && (
                <div className="bg-surface-container border-b-2 border-outline-variant/30 p-3 sm:p-4 shrink-0 transition-all">
                  {activeTransaction ? (
                    activeTransaction.status === 'pending' ? (
                      /* Pending Transaction Bar */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border-2 border-primary/40 rounded-2xl p-3 sm:p-4 shadow-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/40 rounded text-[10px] font-black uppercase">
                              Campus Trade In Progress
                            </span>
                            <span className="text-xs font-black text-primary font-['Space_Grotesk']">
                              Agreed: ₹{parseFloat(activeTransaction.agreed_price).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <p className="text-xs text-on-surface-variant">
                            Share your code in person during meetup to verify the handoff:
                          </p>

                          {activeTransaction.my_otp && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs font-bold text-on-surface">Your Code:</span>
                              <span className="px-3 py-1 bg-primary text-black font-black text-base rounded-lg tracking-widest font-mono">
                                {activeTransaction.my_otp}
                              </span>
                              <button
                                onClick={() => handleCopyOtp(activeTransaction.my_otp!)}
                                className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors text-xs flex items-center gap-1 font-bold cursor-pointer"
                              >
                                {copiedOtp ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedOtp ? "Copied" : "Copy"}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => setIsVerifyModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary-container text-on-primary-container border-2 border-black rounded-xl font-black text-xs uppercase tracking-tight hover:translate-x-[1px] hover:translate-y-[1px] transition-all shadow-sm cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4" />
                            Enter {selectedConversation.other_user.name.split(' ')[0]}'s Code
                          </button>
                        </div>
                      </div>
                    ) : activeTransaction.status === 'completed' ? (
                      /* Completed Transaction Bar */
                      <div className="flex items-center justify-between gap-3 bg-primary/10 border-2 border-primary/30 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Trade Completed on {activeTransaction.completed_at ? new Date(activeTransaction.completed_at).toLocaleDateString() : 'Campus'}!</span>
                        </div>

                        {!activeTransaction.has_reviewed ? (
                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black border-2 border-black rounded-xl font-black text-xs uppercase hover:scale-105 transition-transform cursor-pointer shadow-sm"
                          >
                            <Star className="w-3.5 h-3.5 fill-black" />
                            Leave Review
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Reviewed
                          </span>
                        )}
                      </div>
                    ) : null
                  ) : (
                    /* No Transaction Yet -> Option to Initiate */
                    <div className="flex items-center justify-between gap-3 bg-surface border border-outline-variant/30 rounded-2xl p-3">
                      <div className="text-xs text-on-surface-variant flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-primary" />
                        <span>Ready to meet? Lock in a safe on-campus exchange with 6-digit OTP verification.</span>
                      </div>

                      <button
                        onClick={handleInitiateTrade}
                        disabled={isInitiatingTrade}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-on-primary-container border-2 border-black rounded-xl font-black text-xs uppercase tracking-tight hover:-translate-y-0.5 transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {isInitiatingTrade ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <KeyRound className="w-3.5 h-3.5" />
                            Initiate Safe Trade
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Feed */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {isLoadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-base text-on-surface">Start the conversation</h4>
                    <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
                      Say hello to {selectedConversation.other_user.name} and ask questions or arrange a safe campus meetup.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMyMessage = Boolean(
                      (user?.id && msg.sender === user.id) || 
                      (user?.email && msg.sender_email === user.email) ||
                      (user?.first_name && msg.sender_name.toLowerCase() === user.first_name.toLowerCase())
                    );
                    
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex items-end gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}
                      >
                        {!isMyMessage && (
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 overflow-hidden mb-1">
                            {msg.sender_avatar ? (
                              <img src={msg.sender_avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              msg.sender_name.charAt(0).toUpperCase()
                            )}
                          </div>
                        )}

                        <div className={`max-w-[75%] sm:max-w-md rounded-2xl px-4 py-2.5 space-y-1 ${
                          isMyMessage 
                            ? "bg-primary text-black rounded-br-none border-2 border-black shadow-sm"
                            : "bg-surface-container border border-outline-variant/30 text-on-surface rounded-bl-none shadow-sm"
                        }`}>
                          <p className="text-xs sm:text-sm font-medium leading-relaxed break-words whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          <div className={`flex items-center gap-1 justify-end text-[10px] ${
                            isMyMessage ? "text-black/70 font-bold" : "text-on-surface-variant font-medium"
                          }`}>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMyMessage && (
                              <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-outline-variant/20 bg-surface-container shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${selectedConversation.other_user.name}...`}
                    className="flex-1 px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-2xl text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isSending}
                    className="p-3 bg-primary-container text-on-primary-container border-2 border-black rounded-2xl font-black hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 shrink-0 cursor-pointer shadow-sm"
                    title="Send message"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-xl font-black text-on-surface uppercase">Your Student Messages</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Select a conversation from the left or message a seller directly from any marketplace listing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layer 5 Modals */}
      {selectedConversation && activeTransaction && (
        <>
          <VerifyExchangeModal
            isOpen={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
            transactionId={activeTransaction.id}
            partnerName={selectedConversation.other_user.name}
            onSuccess={(updatedTransaction) => {
              setActiveTransaction(updatedTransaction);
              fetchMessages(selectedConversation.id, false);
            }}
          />

          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            transactionId={activeTransaction.id}
            partnerName={selectedConversation.other_user.name}
            onSuccess={() => {
              fetchTransactionContext();
            }}
          />
        </>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
