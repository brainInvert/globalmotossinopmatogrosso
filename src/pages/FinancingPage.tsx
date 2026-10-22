import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  ShieldCheck,
  Percent,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export const FinancingPage: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(45000);
  const [downPayment, setDownPayment] = useState<number>(9000);
  const [months, setMonths] = useState<number>(36);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState<number>(1.69); // % a.m.

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Calculations
  const downPaymentPercent = vehiclePrice > 0 ? Math.round((downPayment / vehiclePrice) * 100) : 0;
  const financedAmount = Math.max(0, vehiclePrice - downPayment);
  const rateDecimal = monthlyInterestRate / 100;

  const monthlyInstallment = financedAmount > 0
    ? (financedAmount * (rateDecimal * Math.pow(1 + rateDecimal, months))) / (Math.pow(1 + rateDecimal, months) - 1)
    : 0;

  const totalFinancedPayment = monthlyInstallment * months;
  const totalInterestPaid = Math.max(0, totalFinancedPayment - financedAmount);
  const totalCost = downPayment + totalFinancedPayment;

  // Annual CET estimate: (1 + i)^12 - 1
  const annualRate = (Math.pow(1 + rateDecimal, 12) - 1) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculadora de Crédito Automotivo</span>
        </div>
        <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Simulador de Financiamento de Motos
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-normal leading-relaxed">
          Calcule as parcelas mensais pelo sistema CDC (Crédito Direto ao Consumidor), estime o Custo Efetivo Total (CET) e planeje a compra da sua motocicleta com total clareza.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Simulator Form Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-['Outfit'] font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">
            Dados da Simulação
          </h2>

          {/* 1. Vehicle Price */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Valor da Moto (R$)
              </label>
              <span className="text-base font-extrabold text-slate-900 tabular-nums">
                {formatCurrency(vehiclePrice)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="2000"
              value={vehiclePrice}
              onChange={(e) => {
                const p = Number(e.target.value);
                setVehiclePrice(p);
                if (downPayment > p * 0.8) {
                  setDownPayment(Math.round(p * 0.2));
                }
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>R$ 10.000</span>
              <span>R$ 100.000</span>
              <span>R$ 200.000</span>
            </div>
          </div>

          {/* 2. Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Valor de Entrada (R$ e %)
              </label>
              <span className="text-base font-extrabold text-slate-900 tabular-nums">
                {formatCurrency(downPayment)}{' '}
                <span className="text-xs font-semibold text-blue-600">({downPaymentPercent}%)</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={vehiclePrice * 0.85}
              step="1000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex gap-2 mt-2">
              {[10, 20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPayment(Math.round(vehiclePrice * (pct / 100)))}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                    downPaymentPercent === pct
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pct}% Entrada
                </button>
              ))}
            </div>
          </div>

          {/* 3. Number of Installments */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Número de Parcelas (Prazo)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[12, 24, 36, 48, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    months === m
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m} meses
                </button>
              ))}
            </div>
          </div>

          {/* 4. Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Taxa de Juros Mensal Estimada
              </label>
              <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                {monthlyInterestRate.toFixed(2)}% a.m.{' '}
                <span className="text-slate-500 font-normal text-xs">
                  (~{annualRate.toFixed(1)}% a.a.)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0.99"
              max="2.99"
              step="0.05"
              value={monthlyInterestRate}
              onChange={(e) => setMonthlyInterestRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              A taxa real varia conforme score de crédito e instituição financeira (bancos e montadoras).
            </p>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
              Resultado da Estimativa
            </span>

            {/* Main installment readout */}
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs text-slate-300 block">Valor da Parcela Mensal</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white tabular-nums tracking-tight">
                  {formatCurrency(monthlyInstallment)}
                </span>
                <span className="text-xs font-semibold text-blue-400">em {months}x</span>
              </div>
            </div>

            {/* Detail breakdown table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Valor Financiado:</span>
                <span className="font-bold text-white tabular-nums">
                  {formatCurrency(financedAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Total de Juros Pagos:</span>
                <span className="font-bold text-blue-400 tabular-nums">
                  {formatCurrency(totalInterestPaid)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Custo Efetivo Total (CET aprox.):</span>
                <span className="font-bold text-white tabular-nums">
                  {annualRate.toFixed(2)}% a.a.
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Valor Total com Entrada:</span>
                <span className="tabular-nums text-blue-400">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <Link
              to={`/motos?maxPrice=${vehiclePrice + 5000}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all text-center"
            >
              <span>Ver Motos nesta Faixa de Preço</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Advice card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs text-slate-600">
            <h3 className="font-['Outfit'] font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recomendações do Portal Duas Rodas
            </h3>
            <ul className="space-y-2 list-disc list-inside text-slate-500">
              <li>Mantenha o valor da parcela em até 30% da sua renda mensal líquida.</li>
              <li>Reserve de 5% a 8% do valor da moto para despesas com transferência e IPVA.</li>
              <li>Considere contratar seguro compreensivo contra roubo e furto.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
