
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { generateImage, analyzeImage, searchGrounding } from '../services/geminiService';

const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

const IALabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'analysis' | 'search'>('image');

  // Image Gen State
  const [imgPrompt, setImgPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);

  // Analysis State
  const [analysisPrompt, setAnalysisPrompt] = useState('Analise os pontos principais desta imagem administrativa.');
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!imgPrompt) return;
    setImgLoading(true);
    try {
      const url = await generateImage(imgPrompt, aspectRatio);
      setGeneratedImg(url);
    } catch (err) {
      alert("Erro ao gerar imagem.");
    } finally {
      setImgLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!filePreview) return;
    setAnalysisLoading(true);
    try {
      const base64 = filePreview.split(',')[1];
      const mime = filePreview.split(';')[0].split(':')[1];
      const res = await analyzeImage(base64, mime, analysisPrompt);
      setAnalysisResult(res || '');
    } catch (err) {
      alert("Erro ao analisar imagem.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setSearchLoading(true);
    try {
      const res = await searchGrounding(searchQuery);
      setSearchResult(res);
    } catch (err) {
      alert("Erro na pesquisa inteligente.");
    } finally {
      setSearchLoading(true);
      setTimeout(() => setSearchLoading(false), 100); // UI fix for grounding metadata
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">IA Lab</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ICONS.Sparkles className="text-indigo-600" />
            IA Lab: Inteligência Criativa
          </h1>
          <p className="text-sm text-gray-500">Ferramentas avançadas da Gemini para enriquecer seu conteúdo pedagógico.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('image')} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Geração de Imagem</button>
        <button onClick={() => setActiveTab('analysis')} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'analysis' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Análise Visual</button>
        <button onClick={() => setActiveTab('search')} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'search' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Pesquisa Inteligente</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'image' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Gerar Ilustração Pedagógica</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">O que você deseja ilustrar?</label>
                <textarea 
                  placeholder="Ex: Uma sala de reuniões moderna com executivos discutindo planejamento estratégico..."
                  className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Proporção (Aspect Ratio)</label>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_RATIOS.map(ratio => (
                    <button 
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${aspectRatio === ratio ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-400'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={handleGenerateImage}
                disabled={imgLoading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {imgLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <ICONS.Image className="w-5 h-5" />}
                Gerar Imagem com Gemini 3 Pro
              </button>
            </div>
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden min-h-[300px]">
              {generatedImg ? (
                <img src={generatedImg} alt="Generated" className="w-full h-full object-contain" />
              ) : imgLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
                  <p className="text-xs text-indigo-600 font-bold animate-pulse">Criando sua ilustração...</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Sua imagem aparecerá aqui</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Analisar Gráficos ou Documentos</h3>
              <div className="space-y-4">
                <label className="block w-full cursor-pointer group">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 group-hover:border-indigo-400 transition-colors">
                    <ICONS.FilePlus className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-bold text-gray-600">Upload de imagem</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </label>
                {filePreview && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">O que a IA deve buscar?</label>
                    <textarea 
                      className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={analysisPrompt}
                      onChange={(e) => setAnalysisPrompt(e.target.value)}
                    />
                    <button 
                      onClick={handleAnalyze}
                      disabled={analysisLoading}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {analysisLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <ICONS.Robot className="w-5 h-5" />}
                      Analisar com IA
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {filePreview && (
                <div className="h-48 rounded-xl overflow-hidden border border-gray-100">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[100px] text-sm leading-relaxed text-gray-700">
                {analysisResult || (analysisLoading ? "Analisando..." : "Os resultados da análise aparecerão aqui.")}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="max-w-2xl space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Smart Search (Grounding)</h3>
              <p className="text-sm text-gray-500">Encontre as informações mais atualizadas da web para suas aulas, com fontes citadas.</p>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ex: Tendências de RH em 2025 para pequenas empresas..."
                  className="w-full pl-4 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Pesquisar
                </button>
              </div>
            </div>

            {searchLoading && (
              <div className="flex items-center gap-4 text-indigo-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent" />
                <span className="text-sm font-bold">Consultando a web em tempo real...</span>
              </div>
            )}

            {searchResult && !searchLoading && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-100 leading-relaxed whitespace-pre-wrap">
                  {searchResult.text}
                </div>
                {searchResult.sources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fontes Citadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.sources.map((chunk: any, i: number) => chunk.web && (
                        <a 
                          key={i} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener"
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                        >
                          <ICONS.ExternalLink className="w-3 h-3" />
                          {chunk.web.title || "Fonte externa"}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IALabView;
