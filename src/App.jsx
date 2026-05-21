import React, { useState, useEffect } from 'react';
import { Calculator, User, BookOpen, Quote, ChevronRight, Loader2 } from 'lucide-react';

export default function App() {
  const modes = [
    { id: 'kuadrat', label: 'Fungsi Kuadrat' },
    { id: 'substitusi', label: 'Nilai Fungsi' },
    { id: 'invers', label: 'Fungsi Invers' },
    { id: 'komposisi', label: 'Fungsi Komposisi' }
  ];

  const [activeMode, setActiveMode] = useState('kuadrat');
  const [inputs, setInputs] = useState({ a: 1, b: 2, c: 1, x: 2 });
  const [showSolution, setShowSolution] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset default values based on C++ program defaults when mode changes
  useEffect(() => {
    setShowSolution(false);
    switch (activeMode) {
      case 'kuadrat':
        setInputs({ a: 1, b: 2, c: 1, x: 2 });
        break;
      case 'substitusi':
        setInputs({ a: 1, b: 3, c: -4, x: -2 }); // f(x) = x^2 + 3x - 4, x = -2
        break;
      case 'invers':
        setInputs({ a: 3, b: -4, c: 0, x: 5 }); // f(x) = 3x - 4, x = 5
        break;
      case 'komposisi':
        setInputs({ a: 2, b: 0, c: 1, x: 3 }); // f(x) = 2x, g(x) = x^2 + 1, x = 3
        break;
    }
  }, [activeMode]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value === '' ? '' : Number(value) }));
    setShowSolution(false);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setShowSolution(false);
    setTimeout(() => {
      setIsCalculating(false);
      setShowSolution(true);
    }, 800); // Memberikan efek "berpikir" seperti AI selama 0.8 detik
  };

  // Helper untuk format tanda plus/minus
  const fmtSign = (num) => num < 0 ? `- ${Math.abs(num)}` : `+ ${Math.abs(num)}`;
  const fmtNum = (num) => num || 0;

  const renderInputs = () => {
    const inputStyle = "w-12 md:w-16 text-center bg-gray-100 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 focus:bg-blue-50 text-base md:text-lg font-bold rounded-t-md mx-1 md:mx-2 py-1 transition-colors";
    
    return (
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col items-center justify-center w-full overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-hide pb-2">
          <div className="flex items-center justify-center text-base md:text-xl font-mono whitespace-nowrap text-gray-800 min-w-max mx-auto px-4">
            
            {activeMode === 'kuadrat' || activeMode === 'substitusi' ? (
              <>
                <span>f(x) = </span>
                <input type="number" className={inputStyle} value={inputs.a} onChange={e => handleInputChange('a', e.target.value)} />
                <span>x² {inputs.b < 0 ? '-' : '+'} </span>
                <input type="number" className={inputStyle} value={Math.abs(inputs.b)} onChange={e => handleInputChange('b', inputs.b < 0 ? -e.target.value : e.target.value)} />
                <span>x {inputs.c < 0 ? '-' : '+'} </span>
                <input type="number" className={inputStyle} value={Math.abs(inputs.c)} onChange={e => handleInputChange('c', inputs.c < 0 ? -e.target.value : e.target.value)} />
              </>
            ) : activeMode === 'invers' ? (
              <>
                <span>f(x) = </span>
                <input type="number" className={inputStyle} value={inputs.a} onChange={e => handleInputChange('a', e.target.value)} />
                <span>x {inputs.b < 0 ? '-' : '+'} </span>
                <input type="number" className={inputStyle} value={Math.abs(inputs.b)} onChange={e => handleInputChange('b', inputs.b < 0 ? -e.target.value : e.target.value)} />
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center">
                  <span>f(x) = </span>
                  <input type="number" className={inputStyle} value={inputs.a} onChange={e => handleInputChange('a', e.target.value)} />
                  <span>x</span>
                </div>
                <div className="flex items-center">
                  <span>g(x) = x² {inputs.c < 0 ? '-' : '+'} </span>
                  <input type="number" className={inputStyle} value={Math.abs(inputs.c)} onChange={e => handleInputChange('c', inputs.c < 0 ? -e.target.value : e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-6 flex items-center text-base md:text-lg font-mono flex-wrap justify-center text-center gap-2">
          <span className="text-blue-600 font-bold">Substitusi nilai x = </span>
          <input type="number" className={`${inputStyle} w-16 md:w-24 border-blue-600 mx-0`} value={inputs.x} onChange={e => handleInputChange('x', e.target.value)} />
        </div>

        <button 
          onClick={handleCalculate}
          disabled={isCalculating}
          className="mt-6 md:mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 md:px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center w-full md:w-auto"
        >
          {isCalculating ? (
            <><Loader2 className="animate-spin mr-2" size={20} /> Menghitung...</>
          ) : (
            <><Calculator className="mr-2" size={20} /> Hitung Penyelesaian</>
          )}
        </button>
      </div>
    );
  };

  const renderSolution = () => {
    if (!showSolution) return null;

    const { a, b, c, x } = inputs;
    const vA = fmtNum(a), vB = fmtNum(b), vC = fmtNum(c), vX = fmtNum(x);

    let content = null;

    if (activeMode === 'kuadrat') {
      const hasil = (vA * vX * vX) + (vB * vX) + vC;
      content = (
        <>
          <div className="text-gray-700 font-mono space-y-2">
            <p>f({vX}) = ({vA} × {vX}²) + ({vB} × {vX}) + ({vC})</p>
            <p>f({vX}) = ({vA * vX * vX}) + ({vB * vX}) {fmtSign(vC)}</p>
            <p>f({vX}) = {hasil}</p>
          </div>
          <div className="mt-4 p-4 bg-blue-100 rounded-2xl border-l-4 border-blue-500">
            <p className="font-bold text-blue-800">Hasil akhirnya adalah: {hasil}</p>
          </div>
        </>
      );
    } 
    
    else if (activeMode === 'substitusi') {
      const kuadrat = Math.pow(vX, 2) * vA;
      const perkalian = vB * vX;
      const jumlah_tengah = kuadrat + perkalian;
      const hasil = jumlah_tengah + vC;

      content = (
        <>
          <div className="text-gray-700 font-mono space-y-2">
            <p>x = {vX}</p>
            <p>f(x) = {vA === 1 ? '' : vA}({vX})² {fmtSign(vB)}({vX}) {fmtSign(vC)}</p>
            <p>f(x) = {kuadrat} + ({perkalian}) {fmtSign(vC)}</p>
            <p>f(x) = {jumlah_tengah} {fmtSign(vC)}</p>
            <p>f(x) = {hasil}</p>
          </div>
          <div className="mt-4 p-4 bg-green-100 rounded-2xl border-l-4 border-green-500">
            <p className="font-bold text-green-800">Nilai dari f({vX}) adalah = {hasil}</p>
          </div>
        </>
      );
    }

    else if (activeMode === 'invers') {
      const hasil_f = (vA * vX) + vB;
      const pembilang_inv = hasil_f - vB;
      const hasil_inv = pembilang_inv / vA;

      content = (
        <>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-bold text-gray-800">1. Misalkan f(x) = y:</p>
              <p className="font-mono ml-4">y = {vA}x {fmtSign(vB)}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">2. Pindahkan ruas untuk mengisolasi x:</p>
              <p className="font-mono ml-4">y {fmtSign(-vB)} = {vA}x</p>
              <p className="font-mono ml-4">x = (y {fmtSign(-vB)}) / {vA}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">3. Tuliskan kembali dalam variabel x:</p>
              <p className="font-mono ml-4">f⁻¹(x) = (x {fmtSign(-vB)}) / {vA}</p>
            </div>
            
            <hr className="border-gray-300" />
            
            <div>
              <p className="font-bold text-blue-800 flex items-center"><ChevronRight size={18}/> Uji Coba Perhitungan:</p>
              <p className="font-mono ml-4">Jika x = {vX}, maka:</p>
              <p className="font-mono ml-4">f({vX}) = {vA}({vX}) {fmtSign(vB)} = {hasil_f}</p>
              <p className="font-mono ml-4 mt-2">Maka f⁻¹({hasil_f}) harus kembali menjadi {vX}:</p>
              <p className="font-mono ml-4">f⁻¹({hasil_f}) = ({hasil_f} {fmtSign(-vB)}) / {vA}</p>
              <p className="font-mono ml-4">f⁻¹({hasil_f}) = {pembilang_inv} / {vA}</p>
              <p className="font-mono ml-4 text-blue-700 font-bold">= {hasil_inv}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-purple-100 rounded-2xl border-l-4 border-purple-500">
            <p className="font-bold text-purple-800 text-sm md:text-base">Fungsi Invers f⁻¹(x) terbukti menghasilkan kembali nilai awal.</p>
          </div>
        </>
      );
    }

    else if (activeMode === 'komposisi') {
      const g_kuadrat = Math.pow(vX, 2);
      const hasil_g = g_kuadrat + vC;
      const hasil_fog = vA * hasil_g;

      content = (
        <>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-bold text-gray-800">1. Definisi Fungsi Komposisi:</p>
              <p className="font-mono ml-4">(f o g)(x) = f(g(x))</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">2. Substitusi g(x) ke dalam f(x):</p>
              <p className="font-mono ml-4">f(x² {fmtSign(vC)})</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">3. Hitung Hasil Akhir Secara Aljabar:</p>
              <p className="font-mono ml-4">= {vA}(x² {fmtSign(vC)})</p>
              <p className="font-mono ml-4">= {vA}x² {fmtSign(vA * vC)}</p>
            </div>

            <hr className="border-gray-300" />

            <div>
              <p className="font-bold text-orange-800 flex items-center"><ChevronRight size={18}/> Contoh jika nilai x = {vX}:</p>
              <p className="font-mono ml-4">g({vX}) = {vX}² {fmtSign(vC)}</p>
              <p className="font-mono ml-4">g({vX}) = {g_kuadrat} {fmtSign(vC)}</p>
              <p className="font-mono ml-4 font-bold text-orange-700">= {hasil_g}</p>
              
              <p className="font-mono ml-4 mt-3">f(g({vX})) = f({hasil_g})</p>
              <p className="font-mono ml-4">f({hasil_g}) = {vA}({hasil_g})</p>
              <p className="font-mono ml-4 text-orange-700 font-bold">= {hasil_fog}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-orange-100 rounded-2xl border-l-4 border-orange-500">
            <p className="font-bold text-orange-800">Hasil akhir (f o g)({vX}) adalah {hasil_fog}</p>
          </div>
        </>
      );
    }

    return (
      <div className="bg-gray-50 rounded-3xl p-6 md:p-8 shadow-inner animate-[fadeUp_0.8s_ease-out_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
          <Calculator className="mr-2" size={20} /> Langkah-Langkah Penyelesaian
        </h3>
        <div className="overflow-x-auto scrollbar-hide pb-2">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      
      {/* Definisi keyframe animasi bergaya AI & Utility Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        /* Sembunyikan scrollbar agar tampilan mobile lebih bersih saat digeser */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Header & Kapsul Mode */}
      <div className="w-full max-w-2xl mb-6 md:mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-1 drop-shadow-sm">
          Kalkulator Fungsi Matematika
        </h1>
        <p className="text-center text-gray-500 font-medium mb-5 md:mb-6 text-sm tracking-wide">
          by Risky Pratama
        </p>
        
        {/* Menu Kapsul bergaya Liquid Glass iOS - Responsif & Swipeable */}
        <div className="bg-white/40 backdrop-blur-md border border-white/60 p-1.5 md:rounded-full rounded-3xl flex overflow-x-auto scrollbar-hide shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] w-full mx-auto relative snap-x snap-mandatory">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex-none snap-center whitespace-nowrap text-xs md:text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-300 ease-in-out mx-0.5 ${
                activeMode === mode.id 
                  ? 'bg-white/90 text-blue-600 shadow-sm backdrop-blur-lg border border-white/50 transform scale-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/30 scale-95'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Konten Utama */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl overflow-hidden transition-all duration-500 relative z-10 border border-white/50">
        <div className="p-4 md:p-8">
          {renderInputs()}
          {renderSolution()}
        </div>
      </div>

      {/* Profil & Footer Android Style */}
      <div className="w-full max-w-2xl mt-6 md:mt-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-md border-t-4 border-blue-500 relative overflow-hidden border-x border-b border-white/50">
          {/* Latar Belakang Dekoratif */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
          
          <div className="flex items-center mb-4 text-blue-600">
            <User className="mr-2" size={24} />
            <h3 className="font-bold text-base md:text-lg">Identitas Penyusun</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-700 mb-6">
            <div className="space-y-1">
              <p><span className="text-gray-500 block sm:inline">Nama:</span> <strong className="text-gray-900">Risky Pratama</strong></p>
              <p><span className="text-gray-500 block sm:inline">NIM:</span> <strong className="text-gray-900">202557201013</strong></p>
            </div>
            <div className="space-y-1">
              <p><span className="text-gray-500 block sm:inline">Jurusan:</span> <strong className="text-gray-900">Sistem Informasi</strong></p>
              <p><span className="text-gray-500 block sm:inline">Dosen Pengampu:</span> <strong className="text-gray-900">Dr. Kamariah, S.Pd., M.Pd.</strong></p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 md:p-5 relative">
            <Quote className="absolute top-3 left-3 text-blue-200 rotate-180" size={32} />
            <p className="relative z-10 text-center italic text-blue-800 font-medium px-4 text-sm md:text-base leading-relaxed">
              "Lelahnya belajar saat ini jauh lebih baik daripada pahitnya penyesalan karena ketidaktahuan di masa depan."
            </p>
          </div>
          
          <p className="text-center font-bold tracking-widest text-gray-400 mt-6 text-sm">
            --- TERIMA KASIH ---
          </p>
        </div>
      </div>

    </div>
  );
}