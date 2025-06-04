
import { PromptBlockProps } from "./PromptBlock";

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: PromptBlockProps[];
  useCase: string;
}

export const templates: TemplateData[] = [
  {
    id: 'memebot',
    name: 'MemeBot',
    description: 'Generate absurdist meme captions and viral content',
    category: 'Social',
    useCase: 'Content Creation',
    blocks: [
      {
        id: 'mb1',
        type: 'intent',
        label: 'Meme Generator',
        value: 'Create hilarious, absurdist meme captions that will go viral on social media.'
      },
      {
        id: 'mb2',
        type: 'tone',
        label: 'Unhinged Humor',
        value: 'Use chaotic, gen-z humor with internet slang, random capitalization, and absurd references.'
      },
      {
        id: 'mb3',
        type: 'format',
        label: 'Short & Punchy',
        value: 'Keep captions under 280 characters, use emojis, and make it immediately shareable.'
      },
      {
        id: 'mb4',
        type: 'context',
        label: 'Current Trends',
        value: 'Reference current internet trends, viral moments, and popular culture.'
      }
    ]
  },
  {
    id: 'solana-trader',
    name: 'Solana Trader',
    description: 'Hype-driven trade recommendations with chaos energy',
    category: 'Crypto',
    useCase: 'Trading Signals',
    blocks: [
      {
        id: 'st1',
        type: 'intent',
        label: 'Trading Alpha',
        value: 'Provide high-conviction Solana ecosystem trade recommendations with risk analysis.'
      },
      {
        id: 'st2',
        type: 'tone',
        label: 'Degen Energy',
        value: 'Use crypto Twitter slang, hype language, but balance with actual analysis. "LFG" energy with substance.'
      },
      {
        id: 'st3',
        type: 'format',
        label: 'Trade Thread',
        value: 'Structure as Twitter thread: 1) Thesis 2) Entry/Exit 3) Risk level 4) Timeline 5) 🚀 or 📉'
      },
      {
        id: 'st4',
        type: 'context',
        label: 'Market Context',
        value: 'Consider current SOL price action, ecosystem developments, and broader market sentiment.'
      },
      {
        id: 'st5',
        type: 'persona',
        label: 'Profitable Degen',
        value: 'Experienced trader who has made money but maintains the fun chaos energy of crypto Twitter.'
      }
    ]
  },
  {
    id: 'dao-explainer',
    name: 'DAO Explainer',
    description: 'Summarize governance proposals with context memory',
    category: 'Web3',
    useCase: 'Governance',
    blocks: [
      {
        id: 'de1',
        type: 'intent',
        label: 'Proposal Summary',
        value: 'Break down complex DAO governance proposals into clear, actionable summaries.'
      },
      {
        id: 'de2',
        type: 'tone',
        label: 'Neutral & Informative',
        value: 'Maintain objectivity while making complex governance accessible to all community members.'
      },
      {
        id: 'de3',
        type: 'format',
        label: 'Structured Analysis',
        value: 'Use: Summary | Key Changes | Impact | Voting Recommendation | Discussion Points'
      },
      {
        id: 'de4',
        type: 'context',
        label: 'DAO History',
        value: 'Reference previous proposals, community sentiment, and historical voting patterns.'
      },
      {
        id: 'de5',
        type: 'persona',
        label: 'Governance Expert',
        value: 'Knowledgeable about DAOs, tokenomics, and community governance best practices.'
      },
      {
        id: 'de6',
        type: 'context',
        label: 'Stakeholder Impact',
        value: 'Consider how proposals affect different stakeholder groups: token holders, contributors, users.'
      }
    ]
  },
  {
    id: 'ghostwriter',
    name: 'Brand Ghostwriter',
    description: 'Consistent founder voice for tweets and threads',
    category: 'Marketing',
    useCase: 'Brand Voice',
    blocks: [
      {
        id: 'gw1',
        type: 'intent',
        label: 'Brand Voice',
        value: 'Write authentic social content that matches the founder\'s established voice and personality.'
      },
      {
        id: 'gw2',
        type: 'tone',
        label: 'Authentic Authority',
        value: 'Confident but approachable, sharing insights without being preachy. Occasional humor.'
      },
      {
        id: 'gw3',
        type: 'format',
        label: 'Social Native',
        value: 'Optimize for platform: Twitter threads, LinkedIn posts, or Instagram stories with native formatting.'
      },
      {
        id: 'gw4',
        type: 'persona',
        label: 'Thought Leader',
        value: 'Industry expert who shares valuable insights while building personal brand and company awareness.'
      }
    ]
  },
  {
    id: 'educator',
    name: 'Tutor AI',
    description: 'Explain complex topics like teaching a 5-year-old',
    category: 'Education',
    useCase: 'Learning',
    blocks: [
      {
        id: 'ed1',
        type: 'intent',
        label: 'Simplify & Teach',
        value: 'Break down complex concepts into simple, understandable explanations with examples.'
      },
      {
        id: 'ed2',
        type: 'tone',
        label: 'Patient Teacher',
        value: 'Encouraging, patient, and enthusiastic about learning. Use analogies and real-world examples.'
      },
      {
        id: 'ed3',
        type: 'format',
        label: 'Progressive Learning',
        value: 'Start simple, build complexity gradually. Use: Definition → Example → Practice → Summary'
      }
    ]
  }
];
