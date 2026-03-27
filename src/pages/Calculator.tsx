import { useState } from 'react';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';

type Tab = 'simple' | 'compound';

export default function Calculator() {
  const [tab, setTab] = useState<Tab>('simple');

  // Calculadora simples
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  // Juros compostos
  const [principal, setPrincipal] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [compoundResult, setCompoundResult] = useState<{
    total: number;
    invested: number;
    interest: number;
  } | null>(null);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  // === Calculadora simples ===
  function handleNumber(num: string) {
    if (waitingForSecond) {
      setDisplay(num);
      setWaitingForSecond(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }

  function handleDecimal() {
    if (waitingForSecond) {
      setDisplay('0.');
      setWaitingForSecond(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }

  function handleOperator(op: string) {
    const current = parseFloat(display);

    if (firstValue !== null && operator && !waitingForSecond) {
      const result = calculate(firstValue, current, operator);
      setDisplay(String(result));
      setFirstValue(result);
    } else {
      setFirstValue(current);
    }

    setOperator(op);
    setWaitingForSecond(true);
  }

  function calculate(a: number, b: number, op: string): number {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  }

  function handleEquals() {
    if (firstValue === null || operator === null) return;

    const current = parseFloat(display);
    const result = calculate(firstValue, current, operator);

    setDisplay(String(parseFloat(result.toFixed(10))));
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(true);
  }

  function handleClear() {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
  }

  function handlePercent() {
    const current = parseFloat(display);
    if (firstValue !== null) {
      setDisplay(String(firstValue * (current / 100)));
    } else {
      setDisplay(String(current / 100));
    }
  }

  function handleToggleSign() {
    setDisplay(String(parseFloat(display) * -1));
  }

  // === Juros compostos ===
  function calculateCompound() {
    const p = parseFloat(principal) || 0;
    const m = parseFloat(monthlyDeposit) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const n = parseInt(months) || 0;

    if (n <= 0) return;

    let total = p;
    for (let i = 0; i < n; i++) {
      total = (total + m) * (1 + r);
    }

    const invested = p + m * n;
    const interest = total - invested;

    setCompoundResult({ total, invested, interest });
  }

  function clearCompound() {
    setPrincipal('');
    setMonthlyDeposit('');
    setRate('');
    setMonths('');
    setCompoundResult(null);
  }

  const tabClass = (t: Tab) =>
    `flex-1 py-3 text-sm font-semibold rounded-lg transition-colors ${
      tab === t
        ? 'bg-indigo-600 text-white'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  const calcBtnClass =
    'py-4 rounded-xl text-lg font-semibold transition-colors';

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors';

  return (
    <PageTransition>
      <div>
        <PageHead
          title="Calculadora"
          description="Calculadora e simulador de juros compostos"
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Calculadora
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm mb-6 transition-colors">
          <button
            onClick={() => setTab('simple')}
            className={tabClass('simple')}
          >
            Calculadora
          </button>
          <button
            onClick={() => setTab('compound')}
            className={tabClass('compound')}
          >
            Juros Compostos
          </button>
        </div>

        {tab === 'simple' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors max-w-sm mx-auto">
            {/* Display */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 text-right transition-colors">
              {operator && firstValue !== null && (
                <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                  {firstValue} {operator}
                </p>
              )}
              <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                {display}
              </p>
            </div>

            {/* Botões */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleClear}
                className={`${calcBtnClass} bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 col-span-1`}
              >
                C
              </button>
              <button
                onClick={handleToggleSign}
                className={`${calcBtnClass} bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500`}
              >
                +/-
              </button>
              <button
                onClick={handlePercent}
                className={`${calcBtnClass} bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500`}
              >
                %
              </button>
              <button
                onClick={() => handleOperator('÷')}
                className={`${calcBtnClass} bg-indigo-500 text-white hover:bg-indigo-600`}
              >
                ÷
              </button>

              {['7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumber(n)}
                  className={`${calcBtnClass} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOperator('×')}
                className={`${calcBtnClass} bg-indigo-500 text-white hover:bg-indigo-600`}
              >
                ×
              </button>

              {['4', '5', '6'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumber(n)}
                  className={`${calcBtnClass} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOperator('-')}
                className={`${calcBtnClass} bg-indigo-500 text-white hover:bg-indigo-600`}
              >
                -
              </button>

              {['1', '2', '3'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumber(n)}
                  className={`${calcBtnClass} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOperator('+')}
                className={`${calcBtnClass} bg-indigo-500 text-white hover:bg-indigo-600`}
              >
                +
              </button>

              <button
                onClick={() => handleNumber('0')}
                className={`${calcBtnClass} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 col-span-2`}
              >
                0
              </button>
              <button
                onClick={handleDecimal}
                className={`${calcBtnClass} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600`}
              >
                ,
              </button>
              <button
                onClick={handleEquals}
                className={`${calcBtnClass} bg-green-500 text-white hover:bg-green-600`}
              >
                =
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors max-w-lg mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor inicial (R$)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: 1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aporte mensal (R$)
                </label>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: 200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Taxa de juros mensal (%)
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: 1"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Período (meses)
                </label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: 12"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={clearCompound}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={calculateCompound}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Calcular
                </button>
              </div>
            </div>

            {compoundResult && (
              <div className="mt-6 space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    Valor total
                  </p>
                  <p className="text-2xl font-bold text-green-500 dark:text-green-400">
                    {formatCurrency(compoundResult.total)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      Total investido
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(compoundResult.invested)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      Juros ganhos
                    </p>
                    <p className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                      {formatCurrency(compoundResult.interest)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
