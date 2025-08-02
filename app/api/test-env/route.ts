import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    anthropic: !!process.env.NEXT_PUBLIC_ANTHROPIC_KEY,
    openai: !!process.env.OPENAI_API_KEY, // You don't have this, using fallback
    pinecone: !!process.env.PINECONE_API_KEY,
    pineconeEnv: !!process.env.PINECONE_ENVIRONMENT,
    pineconeIndex: process.env.PINECONE_INDEX_NAME || 'smartfeed'
  };

  return NextResponse.json({
    message: 'Environment variables check',
    envCheck,
    allConfigured: envCheck.anthropic && envCheck.pinecone && envCheck.pineconeEnv
  });
} 