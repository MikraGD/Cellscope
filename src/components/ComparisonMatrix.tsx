import React, { useState } from 'react';
import {
  Check,
  X,
  HelpCircle,
  Filter,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CELL_TYPES, ORGANELLES, CellKingdom } from '../data/cellData';

export const ComparisonMatrix: React.FC<{
  onSelectKingdomForMicroscope: (k: CellKingdom) => void;
}> = ({ onSelectKingdomForMicroscope }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const comparisonRows = [
    {
      featureVi: 'Bản chất tổ chức tế bào',
      category: 'general',
      animal: 'Nhân thực (Eukaryote)',
      plant: 'Nhân thực (Eukaryote)',
      fungi: 'Nhân thực (Eukaryote)',
      protist: 'Nhân thực (Eukaryote)',
      bacteria: 'Nhân sơ (Prokaryote)',
    },
    {
      featureVi: 'Kích thước tế bào trung bình',
      category: 'general',
      animal: '10 – 30 µm',
      plant: '20 – 100 µm',
      fungi: '5 – 50 µm',
      protist: '20 – 300 µm',
      bacteria: '0.5 – 5 µm (Siêu vi)',
    },
    {
      featureVi: 'Thành tế bào (Cell Wall)',
      category: 'envelope',
      animal: '❌ Hoàn toàn không có',
      plant: '✅ Cellulose + Pectin',
      fungi: '✅ Kitin (Chitin)',
      protist: '❌ Không có (chỉ có màng pellicle)',
      bacteria: '✅ Peptidoglycan (Murein)',
    },
    {
      featureVi: 'Màng nhân & Hạch nhân',
      category: 'genetic',
      animal: '✅ Có màng nhân kép',
      plant: '✅ Có màng nhân kép',
      fungi: '✅ Có màng nhân kép',
      protist: '✅ Có màng nhân kép (Nhân lớn/nhỏ)',
      bacteria: '❌ Không có (ADN trần vùng nhân)',
    },
    {
      featureVi: 'Lục lạp (Chloroplast)',
      category: 'energy',
      animal: '❌ Không có',
      plant: '✅ Dồi dào (Quang hợp)',
      fungi: '❌ Không có (Dị dưỡng hoại sinh)',
      protist: '⚠️ Có ở trùng roi Euglena, tảo',
      bacteria: '❌ Không có (chỉ vi khuẩn lam có thylakoid rời)',
    },
    {
      featureVi: 'Ty thể (Mitochondria)',
      category: 'energy',
      animal: '✅ Có (Rất nhiều cristae)',
      plant: '✅ Có (Hô hấp song song)',
      fungi: '✅ Có',
      protist: '✅ Có',
      bacteria: '❌ Hoàn toàn không có (Hô hấp trên màng sinh chất)',
    },
    {
      featureVi: 'Không bào trung tâm lớn (Vacuole)',
      category: 'envelope',
      animal: '❌ Không có (chỉ có túi nhỏ)',
      plant: '✅ Khổng lồ (80-90% thể tích)',
      fungi: '⚠️ Không bào dự trữ nhỏ',
      protist: '⚠️ Không bào co bóp & không bào tiêu hóa',
      bacteria: '❌ Không có',
    },
    {
      featureVi: 'Loại hạt Ribosome',
      category: 'general',
      animal: '80S (Bào tương)',
      plant: '80S (Bào tương)',
      fungi: '80S (Bào tương)',
      protist: '80S (Bào tương)',
      bacteria: '70S (Đích của kháng sinh)',
    },
    {
      featureVi: 'Trung thể (Centrosome)',
      category: 'division',
      animal: '✅ Có 2 trung tử',
      plant: '❌ Không có trung tử',
      fungi: '❌ Không có trung tử',
      protist: '⚠️ Biến đổi (thể gốc)',
      bacteria: '❌ Không có',
    },
    {
      featureVi: 'Cầu sinh chất (Plasmodesmata)',
      category: 'envelope',
      animal: '❌ (Có khe Gap Junction thay thế)',
      plant: '✅ Nối tế bào chất liên thông',
      fungi: '❌ (Có lỗ vách ngăn Septal pore)',
      protist: '❌ (Đơn bào độc lập)',
      bacteria: '❌ (Đơn bào)',
    },
    {
      featureVi: 'Hình thức phân chia tế bào',
      category: 'division',
      animal: 'Nguyên phân (Thắt eo tế bào chất)',
      plant: 'Nguyên phân (Tạo vách ngăn cell plate)',
      fungi: 'Nảy chồi hoặc Nguyên phân nội nhân',
      protist: 'Phân đôi dọc / ngang hoặc tiếp hợp',
      bacteria: 'Trực phân (Phân đôi không thoi vô sắc)',
    },
  ];

  const filteredRows = filterCategory === 'all'
    ? comparisonRows
    : comparisonRows.filter((r) => r.category === filterCategory);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-blue-400 font-mono font-semibold tracking-wide">
            ĐỐI CHIẾU TIẾN HÓA & HÌNH THÁI · 5 GIỚI TẾ BÀO
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Ma Trận So Sánh Tế Bào: Động Vật, Thực Vật, Nấm, Nguyên Sinh & Vi Khuẩn
          </h2>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 font-medium rounded-md transition cursor-pointer ${
              filterCategory === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả tiêu chí
          </button>
          <button
            onClick={() => setFilterCategory('energy')}
            className={`px-3 py-1 font-medium rounded-md transition cursor-pointer ${
              filterCategory === 'energy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Năng lượng (Ty thể, Lục lạp)
          </button>
          <button
            onClick={() => setFilterCategory('envelope')}
            className={`px-3 py-1 font-medium rounded-md transition cursor-pointer ${
              filterCategory === 'envelope' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thành & Vách tế bào
          </button>
          <button
            onClick={() => setFilterCategory('division')}
            className={`px-3 py-1 font-medium rounded-md transition cursor-pointer ${
              filterCategory === 'division' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phân bào & Trung thể
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold">
                <th className="p-3.5 w-52 shrink-0">Đặc điểm đối chiếu</th>
                <th className="p-3.5 text-blue-400">
                  <div className="flex items-center justify-between">
                    <span>Động vật</span>
                    <button
                      onClick={() => onSelectKingdomForMicroscope('animal')}
                      className="text-[10px] text-blue-400 hover:underline flex items-center cursor-pointer"
                    >
                      Soi kính ➔
                    </button>
                  </div>
                </th>
                <th className="p-3.5 text-emerald-400">
                  <div className="flex items-center justify-between">
                    <span>Thực vật</span>
                    <button
                      onClick={() => onSelectKingdomForMicroscope('plant')}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center cursor-pointer"
                    >
                      Soi kính ➔
                    </button>
                  </div>
                </th>
                <th className="p-3.5 text-amber-400">
                  <div className="flex items-center justify-between">
                    <span>Nấm (Fungi)</span>
                    <button
                      onClick={() => onSelectKingdomForMicroscope('fungi')}
                      className="text-[10px] text-amber-400 hover:underline flex items-center cursor-pointer"
                    >
                      Soi kính ➔
                    </button>
                  </div>
                </th>
                <th className="p-3.5 text-cyan-400">
                  <div className="flex items-center justify-between">
                    <span>Nguyên sinh</span>
                    <button
                      onClick={() => onSelectKingdomForMicroscope('protist')}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center cursor-pointer"
                    >
                      Soi kính ➔
                    </button>
                  </div>
                </th>
                <th className="p-3.5 text-purple-400">
                  <div className="flex items-center justify-between">
                    <span>Vi khuẩn (Nhân sơ)</span>
                    <button
                      onClick={() => onSelectKingdomForMicroscope('bacteria')}
                      className="text-[10px] text-purple-400 hover:underline flex items-center cursor-pointer"
                    >
                      Soi kính ➔
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/90'
                  }`}
                >
                  <td className="p-3.5 font-semibold text-slate-200 bg-slate-950/40">
                    {row.featureVi}
                  </td>
                  <td className="p-3.5 text-slate-300 leading-relaxed font-mono">
                    {row.animal}
                  </td>
                  <td className="p-3.5 text-slate-300 leading-relaxed font-mono">
                    {row.plant}
                  </td>
                  <td className="p-3.5 text-slate-300 leading-relaxed font-mono">
                    {row.fungi}
                  </td>
                  <td className="p-3.5 text-slate-300 leading-relaxed font-mono">
                    {row.protist}
                  </td>
                  <td className="p-3.5 text-slate-300 leading-relaxed font-mono bg-purple-950/10">
                    {row.bacteria}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evolutionary Insight Card */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Quy luật tiến hóa sinh học: Từ Nhân Sơ đến Nhân Thực Đa Bào
        </h4>
        <p className="text-slate-400 leading-relaxed">
          Sự xuất hiện của màng nhân và các bào quan có màng (như ty thể và lục lạp nhờ thuyết nội cộng sinh) đã cho phép tế bào nhân thực phân vùng các phản ứng hóa sinh chuyên biệt, tăng hiệu suất trao đổi năng lượng lên hàng trăm lần so với vi khuẩn nhân sơ nguyên thủy, tạo tiền đề cho sự bùng nổ của các dạng sống đa bào phức tạp như nấm, cây cỏ và con người.
        </p>
      </div>
    </div>
  );
};
