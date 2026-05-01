import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Sky, ContactShadows, Environment, Box } from '@react-three/drei';
import { Plus, Trash2, RotateCw, Trees, Camera, Download, Upload, Save, Move, Maximize, Minimize, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, Copy, Eraser, Sparkles, Loader2, X, Sun, CloudRain, Snowflake, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ITEM_TEMPLATES, GameObject, Theme, ItemTemplate, Weather } from './types.ts';
import { VoxelModel } from './components/VoxelModel.tsx';
import { cn } from './lib/utils.ts';
import { generateComposition } from './services/aiService.ts';

const WeatherEffects: React.FC<{ weather: Weather }> = ({ weather }) => {
  const points = useRef<any>(null);
  const particleCount = 1000;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const array = points.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      // Falling speed
      const speed = weather === 'rainy' ? 0.3 : 0.05;
      array[i * 3 + 1] -= speed;
      
      // Reset if below ground
      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = 20;
        array[i * 3] = (Math.random() - 0.5) * 40;
        array[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }

      // Wind/Sway
      if (weather === 'snowy') {
        array[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  if (weather === 'sunny') return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={weather === 'rainy' ? 0.05 : 0.15}
        color={weather === 'rainy' ? '#aaaaff' : '#ffffff'}
        transparent
        opacity={0.6}
      />
    </points>
  );
};

const GameScene: React.FC<{
  objects: GameObject[];
  onPlace: (pos: [number, number, number]) => void;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  weather: Weather;
}> = ({ objects, onPlace, onSelect, selectedId, weather }) => {
  return (
    <>
      <Sky sunPosition={weather === 'sunny' ? [100, 20, 100] : [0, -1, 0]} />
      <Environment preset={weather === 'sunny' ? "city" : "night"} />
      <ambientLight intensity={weather === 'sunny' ? 0.8 : weather === 'rainy' ? 0.4 : 0.6} />
      <pointLight position={[10, 10, 10]} intensity={weather === 'sunny' ? 1.2 : 0.5} />
      
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        fadeStrength={5} 
        cellSize={1} 
        sectionSize={5} 
        sectionThickness={1.5}
        sectionColor="#82B3A0"
        cellColor="#A7D7C5"
      />

      <WeatherEffects weather={weather} />

      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        onPointerDown={(e) => {
          e.stopPropagation();
          // Right click (button 2) to place
          if (e.button === 2) {
            onPlace([Math.round(e.point.x), 0, Math.round(e.point.z)]);
          } else if (e.button === 0) {
            // Left click on floor deselects
            onSelect(null);
          }
        }}
        onContextMenu={(e) => e.nativeEvent.preventDefault()}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={weather === 'snowy' ? '#ffffff' : "#A7D7C5"} />
      </mesh>

      {objects.map((obj) => (
        <group 
          key={obj.id} 
          position={obj.position} 
          rotation={[0, obj.rotation, 0]}
          scale={[obj.scale, obj.scale, obj.scale]}
          onPointerDown={(e) => {
            e.stopPropagation();
            // Left click (button 0) to select
            if (e.button === 0) {
              onSelect(obj.id);
            }
          }}
          onContextMenu={(e) => e.nativeEvent.preventDefault()}
        >
          <VoxelModel type={obj.type} color={ITEM_TEMPLATES.find(t => t.type === obj.type)?.color || 'white'} />
          {selectedId === obj.id && (
            <Box args={[1.2, 0.1, 1.2]} position={[0, -0.05, 0]}>
              <meshBasicMaterial color="#FF8B94" transparent opacity={0.5} />
            </Box>
          )}
        </group>
      ))}

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
};

export default function App() {
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme>('sakura');
  const [activeWeather, setActiveWeather] = useState<Weather>('sunny');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ItemTemplate>(ITEM_TEMPLATES[0]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiOverlay, setShowAiOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlace = (pos: [number, number, number]) => {
    const newObj: GameObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedTemplate.type,
      position: pos,
      rotation: 0,
      theme: activeTheme,
      scale: 1,
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  const handleRotate = () => {
    if (!selectedId) return;
    setObjects(objects.map(obj => 
      obj.id === selectedId ? { ...obj, rotation: obj.rotation + Math.PI / 4 } : obj
    ));
  };

  const handleScale = (delta: number) => {
    if (!selectedId) return;
    setObjects(objects.map(obj => 
      obj.id === selectedId ? { ...obj, scale: Math.max(0.1, obj.scale + delta) } : obj
    ));
  };

  const handleMove = (dx: number, dy: number, dz: number) => {
    if (!selectedId) return;
    setObjects(objects.map(obj => 
      obj.id === selectedId ? { ...obj, position: [obj.position[0] + dx, Math.max(0, obj.position[1] + dy), obj.position[2] + dz] } : obj
    ));
  };

  const handleCopy = () => {
    if (!selectedId) return;
    const original = objects.find(obj => obj.id === selectedId);
    if (!original) return;

    const newObj: GameObject = {
      ...original,
      id: Math.random().toString(36).substr(2, 9),
      position: [original.position[0] + 1, original.position[1], original.position[2] + 1], // Offset to see it's copied
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setObjects(objects.filter(obj => obj.id !== selectedId));
    setSelectedId(null);
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `adorable-house-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(objects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `my-corner-layout.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setObjects(data);
          setSelectedId(null);
        }
      } catch (err) {
        alert("匯入失敗：無效的文件格式");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleClearAll = () => {
    // Avoid window.confirm in iframe environments
    setObjects([]);
    setSelectedId(null);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const generated = await generateComposition(aiPrompt);
      if (generated.length > 0) {
        setObjects(generated);
        setShowAiOverlay(false);
        setAiPrompt('');
      } else {
        alert("AI 無法產生內容，請換個說法試試。");
      }
    } catch (error) {
      alert("AI 產生失敗，請稍後再試。");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const currentItems = ITEM_TEMPLATES.filter(item => item.theme === activeTheme);

  return (
    <div className="w-full h-screen bg-[#A7D7C5] font-sans flex flex-col overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        className="hidden" 
        accept=".json"
      />

      {/* Header Navigation */}
      <nav className="h-16 bg-[#ffffffcc] backdrop-blur-sm border-b-4 border-[#82B3A0] flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF8B94] rounded-lg border-b-4 border-r-4 border-[#D9666F] flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-white rounded-sm shadow-sm"></div>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-[#4A6D5F] uppercase tracking-wider">
            可愛方塊屋 <span className="text-[#FF8B94]">Craft</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <button 
            onClick={handleScreenshot}
            className="w-10 h-10 bg-white/50 hover:bg-white rounded-xl border-2 border-[#82B3A0] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="拍照拍照"
          >
            <Camera size={20} className="text-[#82B3A0]" />
          </button>
          <button 
            onClick={handleExport}
            className="w-10 h-10 bg-white/50 hover:bg-white rounded-xl border-2 border-[#82B3A0] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="匯出配置"
          >
            <Download size={20} className="text-[#82B3A0]" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 bg-white/50 hover:bg-white rounded-xl border-2 border-[#82B3A0] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="匯入配置"
          >
            <Upload size={20} className="text-[#82B3A0]" />
          </button>
          <button 
            onClick={handleClearAll}
            className="w-10 h-10 bg-white/50 hover:bg-red-50 rounded-xl border-2 border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="一鍵清除"
          >
            <Eraser size={20} className="text-red-400" />
          </button>
          <button 
            onClick={toggleMusic}
            className={cn(
              "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer shadow-sm",
              isPlaying ? "bg-[#E0F2F1] border-[#82B3A0] text-[#4A6D5F]" : "bg-white/50 border-gray-200 text-gray-400"
            )}
            title={isPlaying ? "暫停音樂" : "播放背景音樂"}
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            onClick={() => setShowAiOverlay(true)}
            className="w-10 h-10 bg-[#FFD700] hover:bg-[#FFC107] rounded-xl border-2 border-[#E5D59A] flex items-center justify-center transition-all cursor-pointer shadow-sm animate-pulse"
            title="AI 智慧構圖"
          >
            <Sparkles size={20} className="text-[#8B7D4B]" />
          </button>

          <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden sm:block" />
          
          <div className="bg-[#F9F1CF] px-4 py-1.5 rounded-full border-2 border-[#E5D59A] flex items-center gap-2 hidden md:flex">
            <span className="text-lg">🌸</span>
            <span className="font-bold text-[#8B7D4B]">{objects.length} / 100</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-4 lg:p-6 gap-6">
        {/* Left: 3D Canvas Area */}
        <div className="relative flex-1 bg-[#C2E7D9] rounded-[30px] lg:rounded-[40px] border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas shadows gl={{ preserveDrawingBuffer: true }} camera={{ position: [8, 8, 8], fov: 45 }}>
              <Suspense fallback={null}>
                <GameScene 
                  objects={objects} 
                  onPlace={handlePlace} 
                  onSelect={setSelectedId}
                  selectedId={selectedId}
                  weather={activeWeather}
                />
              </Suspense>
            </Canvas>
          </div>

          <audio 
            ref={audioRef} 
            src="https://raw.githubusercontent.com/g18321-cloud/web_mp3/main/Barefoot_on_the_Boardwalk.mp3" 
            loop 
            preload="auto"
          />

          {/* Mode Controls Overlay */}
          <AnimatePresence>
            {selectedId && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-[2.5rem] border-4 border-[#82B3A0] flex flex-col gap-4 shadow-xl z-20"
              >
                <div className="flex gap-4 items-center justify-center border-b pb-3 border-gray-100">
                  <div className="grid grid-cols-3 gap-2">
                    <div />
                    <button onClick={() => handleMove(0, 0, -1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><ArrowUp size={16} /></button>
                    <div />
                    <button onClick={() => handleMove(-1, 0, 0)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><ArrowLeft size={16} /></button>
                    <div className="flex items-center justify-center text-[10px] font-bold text-gray-400">移動</div>
                    <button onClick={() => handleMove(1, 0, 0)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><ArrowRight size={16} /></button>
                    <div />
                    <button onClick={() => handleMove(0, 0, 1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><ArrowDown size={16} /></button>
                    <div />
                  </div>
                  
                  <div className="h-12 w-[1px] bg-gray-200 mx-1" />

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleMove(0, 0.5, 0)}
                      className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 text-xs font-bold"
                      title="升高"
                    >
                      <ChevronUp size={16} /> 升高
                    </button>
                    <button 
                      onClick={() => handleMove(0, -0.5, 0)}
                      className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 text-xs font-bold"
                      title="降低"
                    >
                      <ChevronDown size={16} /> 降低
                    </button>
                  </div>
                  
                  <div className="h-12 w-[1px] bg-gray-200 mx-2" />

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleScale(0.1)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-xs font-bold"
                    >
                      <Maximize size={16} /> 放大
                    </button>
                    <button 
                      onClick={() => handleScale(-0.1)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-xs font-bold"
                    >
                      <Minimize size={16} /> 縮小
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 items-center justify-center">
                  <button 
                    onClick={handleRotate}
                    className="p-3 bg-[#A7D7C5] rounded-xl hover:scale-110 transition-transform text-white cursor-pointer flex items-center gap-2 px-4"
                    title="旋轉"
                  >
                    <RotateCw size={20} /> <span className="text-xs font-bold">旋轉</span>
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="p-3 bg-blue-400 rounded-xl hover:scale-110 transition-transform text-white cursor-pointer flex items-center gap-2 px-4"
                    title="複製"
                  >
                    <Copy size={20} /> <span className="text-xs font-bold">複製</span>
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-3 bg-[#FF8B94] rounded-xl text-white font-bold hover:scale-110 transition-transform cursor-pointer flex items-center gap-2 px-4"
                    title="刪除"
                  >
                    <Trash2 size={20} /> <span className="text-xs font-bold">刪除</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions Overlay (Bottom Right) */}
          <div className="absolute bottom-6 right-6 pointer-events-none opacity-50 text-[10px] text-[#4A6D5F] font-bold text-right hidden xl:block">
            右鍵點擊地面放置物件<br />
            左鍵點擊物件進行選取<br />
            左鍵點擊空白地帶取消選取<br />
            升高/降低 物件可實現懸空效果<br />
            滾動縮放視角
          </div>
        </div>

        {/* Right: Sidebar Inventory Panel */}
        <div className="w-80 bg-white rounded-[30px] lg:rounded-[40px] border-8 border-[#82B3A0] flex flex-col p-6 shadow-2xl shrink-0 hidden lg:flex">
          {/* Weather Selector */}
          <div className="mb-6">
            <h3 className="text-[10px] font-black text-[#82B3A0] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sun size={12} /> 天氣動態模擬
            </h3>
            <div className="flex gap-2">
              {(['sunny', 'rainy', 'snowy'] as Weather[]).map((w) => {
                const isActive = activeWeather === w;
                const Icon = w === 'sunny' ? Sun : w === 'rainy' ? CloudRain : Snowflake;
                const label = w === 'sunny' ? '晴天' : w === 'rainy' ? '雨天' : '下雪';
                return (
                  <button
                    key={w}
                    onClick={() => setActiveWeather(w)}
                    className={cn(
                      "flex-1 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer",
                      isActive 
                        ? "bg-[#FF8B94] border-[#FF8B94] text-white shadow-md active-pop" 
                        : "bg-gray-50 border-gray-100 text-[#82B3A0] hover:bg-white hover:border-[#82B3A0]"
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-[9px] font-black">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex justify-around mb-8 p-1 bg-gray-100 rounded-2xl border-2 border-gray-100">
            {(['sakura', 'zoo', 'fuji', 'city'] as Theme[]).map((theme) => {
              const isActive = activeTheme === theme;
              return (
                <button
                  key={theme}
                  onClick={() => {
                    setActiveTheme(theme);
                    setSelectedTemplate(ITEM_TEMPLATES.find(t => t.theme === theme)!);
                  }}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-xl transition-all duration-300 flex-1 cursor-pointer",
                    isActive ? "bg-white shadow-md scale-105" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <span className="text-2xl">
                    {theme === 'sakura' ? '🌸' : theme === 'zoo' ? '🐾' : theme === 'fuji' ? '🗻' : '🏙️'}
                  </span>
                  <span className={cn(
                    "text-[10px] font-black uppercase mt-1",
                    isActive ? "text-[#FF8B94]" : "text-[#82B3A0]"
                  )}>
                    {theme === 'sakura' ? '櫻花祭' : theme === 'zoo' ? '動物園' : theme === 'fuji' ? '富士山' : '城市'}
                  </span>
                  {isActive && <div className="h-1 w-6 bg-[#FF8B94] rounded-full mt-1" />}
                </button>
              );
            })}
          </div>

          {/* Inventory Grid */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              {currentItems.map((item) => (
                <div 
                  key={item.type}
                  onClick={() => setSelectedTemplate(item)}
                  className={cn(
                    "bg-[#F5F5F5] p-3 rounded-2xl border-b-4 border-gray-200 cursor-pointer transition-all hover:border-[#FF8B94] group",
                    selectedTemplate.type === item.type ? "border-[#FF8B94] bg-white ring-2 ring-[#FF8B94]/20" : ""
                  )}
                >
                  <div className={cn(
                    "w-full h-20 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform",
                    selectedTemplate.type === item.type ? "bg-[#FFB7B2]" : "bg-[#E0E0E0]/30"
                  )}>
                    {item.icon}
                  </div>
                  <p className={cn(
                    "mt-2 text-[10px] font-black text-center uppercase tracking-tight",
                    selectedTemplate.type === item.type ? "text-[#FF8B94]" : "text-gray-500"
                  )}>
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#FFF9C4] rounded-2xl border-2 border-[#FBC02D] text-[10px] font-black leading-tight text-[#7F6D00] shadow-sm italic">
            提示：使用拍照功能收藏你的設計！你也可以隨時匯出或匯入你的方塊小屋配置。
          </div>
        </div>
      </div>

      {/* AI Prompt Overlay */}
      <AnimatePresence>
        {showAiOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] border-8 border-[#FFD700] w-full max-w-lg p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAiOverlay(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} className="text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#FFF9C4] rounded-3xl border-4 border-[#FFD700] flex items-center justify-center mb-6">
                  <Sparkles size={40} className="text-[#E5D59A]" />
                </div>
                <h2 className="text-3xl font-black text-[#4A6D5F] mb-4 uppercase tracking-wider">
                  AI 智慧構圖
                </h2>
                <p className="text-[#82B3A0] font-bold mb-8">
                  身為您的專屬設計師，告訴我你想打造什麼樣的場景？
                </p>

                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="例如：一個帶有紅橋、許多櫻花樹和燈籠的深夜花園..."
                  className="w-full bg-gray-50 border-4 border-gray-100 rounded-3xl p-6 text-[#4A6D5F] font-bold focus:border-[#FFD700] outline-none transition-colors min-h-[120px] resize-none mb-8"
                />

                <button 
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating || !aiPrompt.trim()}
                  className={cn(
                    "w-full py-5 rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3",
                    isAiGenerating || !aiPrompt.trim() 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-[#FFD700] text-[#8B7D4B] hover:scale-105 active:scale-95 cursor-pointer"
                  )}
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      設計中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      點召喚設計圖
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Details */}
      <footer className="h-12 bg-[#82B3A0] px-8 flex items-center justify-between text-white text-[10px] lg:text-xs font-black shrink-0 z-50">
        <div className="tracking-widest uppercase">Komorebi Style: {activeTheme}</div>
        <div className="flex gap-6 uppercase tracking-widest hidden sm:flex">
          <span>天氣: {activeWeather === 'sunny' ? '晴天' : activeWeather === 'rainy' ? '雨天' : '下雪'}</span>
          <span>●</span>
          <span>主題風格: {activeTheme === 'sakura' ? '和風・櫻花祭' : activeTheme === 'zoo' ? '療癒・動物園' : activeTheme === 'fuji' ? '壯麗・富士山' : '摩登・城市'}</span>
          <span>●</span>
          <span>擺飾進度: {objects.length} / 100</span>
        </div>
        <div className="flex items-center gap-4">
             <span className="opacity-50">CRAFT ENGINE V1.3</span>
        </div>
      </footer>
    </div>
  );
}
