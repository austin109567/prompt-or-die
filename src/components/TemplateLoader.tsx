
export const templates = [
  {
    id: '1',
    name: 'Content Summarizer',
    description: 'Create concise summaries of long-form content',
    category: 'Content',
    useCase: 'Documentation',
    blocks: [
      {
        id: '1',
        type: 'intent',
        label: 'Summarize Content',
        value: 'Provide a concise summary of the given content, highlighting key points and main ideas.'
      },
      {
        id: '2',
        type: 'tone',
        label: 'Professional',
        value: 'Use clear, professional language suitable for business communications.'
      },
      {
        id: '3',
        type: 'format',
        label: 'Bullet Points',
        value: 'Format the output as organized bullet points with clear hierarchy.'
      }
    ]
  },
  {
    id: '2',
    name: 'Code Reviewer',
    description: 'Analyze code for improvements and best practices',
    category: 'Development',
    useCase: 'Code Review',
    blocks: [
      {
        id: '4',
        type: 'intent',
        label: 'Code Analysis',
        value: 'Review the provided code for potential improvements, bugs, and adherence to best practices.'
      },
      {
        id: '5',
        type: 'persona',
        label: 'Senior Developer',
        value: 'Act as an experienced senior developer with expertise in multiple programming languages.'
      },
      {
        id: '6',
        type: 'format',
        label: 'Structured Review',
        value: 'Organize feedback into categories: Issues, Improvements, Best Practices, and Overall Assessment.'
      }
    ]
  },
  {
    id: '3',
    name: 'Creative Writer',
    description: 'Generate engaging creative content',
    category: 'Creative',
    useCase: 'Writing',
    blocks: [
      {
        id: '7',
        type: 'intent',
        label: 'Creative Writing',
        value: 'Create engaging, original creative content based on the given prompt or theme.'
      },
      {
        id: '8',
        type: 'tone',
        label: 'Imaginative',
        value: 'Use vivid imagery, creative metaphors, and engaging storytelling techniques.'
      },
      {
        id: '9',
        type: 'context',
        label: 'Target Audience',
        value: 'Consider the intended audience and adjust complexity and themes accordingly.'
      }
    ]
  },
  {
    id: '4',
    name: 'Data Analyst',
    description: 'Analyze data and provide insights',
    category: 'Analytics',
    useCase: 'Data Science',
    blocks: [
      {
        id: '10',
        type: 'intent',
        label: 'Data Analysis',
        value: 'Analyze the provided data to identify patterns, trends, and actionable insights.'
      },
      {
        id: '11',
        type: 'persona',
        label: 'Data Scientist',
        value: 'Approach analysis with statistical rigor and business acumen.'
      },
      {
        id: '12',
        type: 'format',
        label: 'Executive Summary',
        value: 'Present findings in an executive summary format with key insights, supporting data, and recommendations.'
      }
    ]
  },
  {
    id: '5',
    name: 'Email Marketing',
    description: 'Craft compelling marketing emails',
    category: 'Marketing',
    useCase: 'Email Campaigns',
    blocks: [
      {
        id: '13',
        type: 'intent',
        label: 'Email Campaign',
        value: 'Create a compelling email that drives engagement and conversions.'
      },
      {
        id: '14',
        type: 'tone',
        label: 'Persuasive',
        value: 'Use persuasive language that builds trust and motivates action.'
      },
      {
        id: '15',
        type: 'format',
        label: 'Email Structure',
        value: 'Include: attention-grabbing subject line, personalized greeting, value proposition, clear call-to-action, and professional signature.'
      }
    ]
  },
  {
    id: '6',
    name: 'Technical Documentation',
    description: 'Create clear technical documentation',
    category: 'Documentation',
    useCase: 'Technical Writing',
    blocks: [
      {
        id: '16',
        type: 'intent',
        label: 'Technical Documentation',
        value: 'Create comprehensive, clear technical documentation that enables users to understand and implement the described process or system.'
      },
      {
        id: '17',
        type: 'tone',
        label: 'Clear & Precise',
        value: 'Use precise technical language while remaining accessible to the target audience.'
      },
      {
        id: '18',
        type: 'format',
        label: 'Structured Guide',
        value: 'Organize with: overview, prerequisites, step-by-step instructions, examples, troubleshooting, and additional resources.'
      }
    ]
  }
];
