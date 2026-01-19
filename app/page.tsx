'use client';

import { useState } from 'react';

interface KGMResult {
  success: boolean;
  data?: {
    plaka: string;
    sorguTarihi: string;
    ozetBilgiler: {
      kgmBorc: string;
      avrasyaBorc: string;
      otoyolBorc: string;
      icaBorc: string;
      avrupaOtoyoluBorc: string;
      anadoluOtoyoluBorc: string;
      kuzeyEgeOtoyoluBorc: string;
      ergBorc: string;
      canakkaleBorc: string;
      fernasBorc: string;
      odenecekTutarKGM: string;
      odenecekTutarYID: string;
      genelToplam: string;
    };
    gecisDetaylari: any[];
  };
  error?: string;
}

export default function Home() {
  const [plaka, setPlaka] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KGMResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plaka: plaka.toUpperCase().replace(/\s+/g, '') }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Bağlantı hatası. Lütfen tekrar deneyin.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🚗 KGM Plaka Sorgulama
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Karayolları ihlal ve borç sorgulama sistemi
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="plaka"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Plaka Numarası
                </label>
                <input
                  type="text"
                  id="plaka"
                  value={plaka}
                  onChange={(e) => setPlaka(e.target.value)}
                  placeholder="Örnek: 34ABC123"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white uppercase"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !plaka}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sorgulanıyor... (30-120 saniye)
                  </>
                ) : (
                  'Sorgula'
                )}
              </button>
            </form>

            {loading && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                  ⏳ CAPTCHA çözülüyor ve KGM sitesi sorgulanıyor...
                  <br />
                  <span className="text-xs">Bu işlem 30-120 saniye sürebilir.</span>
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              {result.success && result.data ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {result.data.plaka}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sorgu: {new Date(result.data.sorguTarihi).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {result.data.ozetBilgiler.genelToplam}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Genel Toplam</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DebtItem
                      label="KGM Borç"
                      amount={result.data.ozetBilgiler.kgmBorc || '0,00 ₺'}
                    />
                    <DebtItem
                      label="Avrasya Borç"
                      amount={result.data.ozetBilgiler.avrasyaBorc || '0,00 ₺'}
                    />
                    <DebtItem
                      label="Otoyol Borç"
                      amount={result.data.ozetBilgiler.otoyolBorc || '0,00 ₺'}
                    />
                    <DebtItem
                      label="İCA Borç"
                      amount={result.data.ozetBilgiler.icaBorc || '0,00 ₺'}
                    />
                    <DebtItem
                      label="Çanakkale Borç"
                      amount={result.data.ozetBilgiler.canakkaleBorc || '0,00 ₺'}
                    />
                    <DebtItem
                      label="ERG Borç"
                      amount={result.data.ozetBilgiler.ergBorc || '0,00 ₺'}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Ödenecek Tutar (KGM):
                      </span>
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">
                        {result.data.ozetBilgiler.odenecekTutarKGM}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Ödenecek Tutar (YİD):
                      </span>
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">
                        {result.data.ozetBilgiler.odenecekTutarYID}
                      </span>
                    </div>
                  </div>

                  {result.data.ozetBilgiler.genelToplam === '0,00 ₺' && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 text-center font-semibold">
                        ✅ Borcunuz bulunmamaktadır
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-center">
                    ❌ {result.error || 'Bir hata oluştu'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Bu sistem KGM (Karayolları Genel Müdürlüğü) veritabanını sorgular.
            </p>
            <p className="mt-1">
              Sonuçlar anlık olarak alınır ve kayıt edilmez.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebtItem({ label, amount }: { label: string; amount: string }) {
  const hasDebt = amount !== '0,00 ₺' && amount !== '';

  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <span className={`font-semibold ${hasDebt ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
        {amount}
      </span>
    </div>
  );
}
