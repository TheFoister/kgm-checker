import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { plaka } = await request.json();

    if (!plaka) {
      return NextResponse.json(
        { success: false, error: 'Plaka numarası gereklidir' },
        { status: 400 }
      );
    }

    // Call n8n webhook
    const n8nWebhook = process.env.N8N_WEBHOOK_URL || 'https://n8n.evren8n.com/webhook/kgm-query';

    const response = await fetch(n8nWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plaka }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error querying KGM:', error);
    return NextResponse.json(
      { success: false, error: 'Sorgu sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
