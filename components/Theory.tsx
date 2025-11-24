import React from 'react';

const Theory: React.FC = () => {
  return (
    <div className="prose prose-slate max-w-none p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">原理与公式推导 (Theory & Derivation)</h2>
      
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 font-serif">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">1. 场矢量定义</h3>
        <p className="mb-2">假设入射波为垂直极化 (TE波)，电场垂直于入射面 (即沿y轴方向)。导体表面位于 <span className="italic">z = 0</span>。</p>
        <p className="mb-2"><strong>入射波 (Incident):</strong></p>
        <div className="bg-white p-3 rounded border border-slate-200 mb-2 overflow-x-auto">
          {`$\\vec{E}_i(x,z) = \\hat{y} E_0 e^{-j(k_x x - k_z z)}$`.replace(/\$/g, '')}
          <div className="mt-1 font-mono text-sm text-slate-600">
             E_i = ŷ E₀ e^(-j(kₓx - k_z z))
          </div>
        </div>
        
        <p className="mb-2"><strong>反射波 (Reflected):</strong> 理想导体表面电场切向分量为0，故反射系数为 -1。</p>
        <div className="bg-white p-3 rounded border border-slate-200 mb-2 overflow-x-auto">
          {`$\\vec{E}_r(x,z) = -\\hat{y} E_0 e^{-j(k_x x + k_z z)}$`.replace(/\$/g, '')}
          <div className="mt-1 font-mono text-sm text-slate-600">
             E_r = -ŷ E₀ e^(-j(kₓx + k_z z))
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-2 mt-4">2. 合成波 (Total Field)</h3>
        <p className="mb-2">根据叠加原理：</p>
        <div className="bg-white p-3 rounded border border-slate-200 mb-2 overflow-x-auto">
           E_total = E_i + E_r <br/>
           = E₀ e^(-jkₓx) [ e^(jk_z z) - e^(-jk_z z) ] <br/>
           = E₀ e^(-jkₓx) [ 2j sin(k_z z) ]
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-2 mt-4">3. 瞬时值表示 (Time Domain)</h3>
        <p className="mb-2">取实部得到物理量：</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-lg font-bold text-blue-900">
            E(x, z, t) = 2 E₀ sin(k_z z) sin(ωt - k_x x)
          </p>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-2 mt-4">4. 物理意义分析</h3>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li>
            <strong className="text-indigo-600">z方向 (垂直表面):</strong> 因子 <code>sin(k_z z)</code> 仅与位置z有关，与时间无关。这表明在垂直表面方向上，波的振幅包络是固定的，形成<strong>驻波 (Standing Wave)</strong>。
          </li>
          <li>
             <strong className="text-indigo-600">x方向 (平行表面):</strong> 因子 <code>sin(ωt - k_x x)</code> 包含 <code>(ωt - kx)</code> 项，表明波形随时间沿x轴正方向移动，形成<strong>行波 (Traveling Wave)</strong>。
          </li>
          <li>
            <strong className="text-indigo-600">相速 (Phase Velocity):</strong> 平行表面的相速为 <code>v_px = ω / k_x = c / sin(θ_i)</code>。当 θ_i 趋近于0时，相速趋于无穷大 (此时k_x -> 0，即所有点同相振荡)。
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Theory;