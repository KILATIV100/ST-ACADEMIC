import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const streets = [
  { id: "LINE_1", name: "1 Лінія", range: "1–33, 343–344" },
  { id: "LINE_2", name: "2 Лінія", range: "34–101" },
  { id: "LINE_3", name: "3 Лінія", range: "102–171" },
  { id: "LINE_4", name: "4 Лінія", range: "172–241" },
  { id: "LINE_5", name: "5 Лінія", range: "242–309" },
  { id: "LINE_6", name: "6 Лінія", range: "310–342" },
];

const names = [
  "Іван Петренко",
  "Олена Коваленко",
  "Сергій Бондар",
  "Марина Шевченко",
  "Андрій Мельник",
  "Вікторія Савченко",
  "Павло Ткаченко",
  "Наталія Романюк",
  "Олександр Гнатюк",
  "Людмила Мороз",
  "Дмитро Клименко",
  "Ірина Левченко",
];

const iconMap = {
  home: "⌂",
  map: "▦",
  wallet: "₴",
  receipt: "≡",
  folder: "▣",
  file: "□",
  search: "⌕",
  alert: "!",
  check: "✓",
  close: "×",
  water: "≈",
  zap: "ϟ",
  truck: "▰",
  shield: "◆",
  users: "◎",
  menu: "☰",
  chevron: "›",
};

function Icon({ name, size = 20, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-black leading-none ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(14, size * 0.8) }}
    >
      {iconMap[name] || "•"}
    </span>
  );
}

function getLineByPlotNumber(plotNumber) {
  if (plotNumber <= 33 || plotNumber >= 343) return "LINE_1";
  if (plotNumber <= 101) return "LINE_2";
  if (plotNumber <= 171) return "LINE_3";
  if (plotNumber <= 241) return "LINE_4";
  if (plotNumber <= 309) return "LINE_5";
  return "LINE_6";
}

function buildPlots() {
  return Array.from({ length: 344 }, (_, index) => {
    const plotNumber = index + 1;
    const debtSeed = (plotNumber * 37) % 9;
    const debt = debtSeed === 0 ? 0 : debtSeed === 1 ? 250 : debtSeed === 2 ? 600 : debtSeed === 3 ? 1200 : debtSeed === 4 ? 2300 : 0;
    const electricDebt = (plotNumber * 19) % 11 === 0 ? 780 : (plotNumber * 13) % 17 === 0 ? 340 : 0;
    const status = debt === 0 && electricDebt === 0 ? "paid" : debt < 800 && electricDebt < 500 ? "partial" : "debt";

    return {
      id: plotNumber,
      plotNumber,
      line: getLineByPlotNumber(plotNumber),
      owner: names[plotNumber % names.length],
      phone: `+38067${String(1000000 + plotNumber * 2341).slice(0, 7)}`,
      area: plotNumber === 344 || plotNumber === 343 ? 0.08 : 0.12,
      membership: plotNumber % 29 === 0 ? "неоформлено" : plotNumber % 41 === 0 ? "спадщина" : "активний",
      debt,
      electricDebt,
      status,
      water: (plotNumber * 5) % 13 === 0 ? "problem" : "ok",
      electricity: electricDebt > 0 || (plotNumber * 7) % 18 === 0 ? "risk" : "ok",
      lastPayment: debt === 0 ? "12.04.2026" : plotNumber % 2 ? "18.02.2026" : "—",
      note: plotNumber % 37 === 0 ? "Потрібно уточнити контакт власника" : "",
    };
  });
}

const allPlots = buildPlots();

const expensesData = [
  { date: "02.04.2026", category: "Дороги", amount: 18500, contractor: "ФОП Грейдер-Сервіс", document: "Акт №12", fund: "Поточний" },
  { date: "08.04.2026", category: "Електрика", amount: 9200, contractor: "ЕлектроМонтаж Київ", document: "Рахунок №44", fund: "Спецфонд" },
  { date: "11.04.2026", category: "Сміття", amount: 12800, contractor: "Комунсервіс", document: "Договір", fund: "Поточний" },
  { date: "17.04.2026", category: "Вода", amount: 6700, contractor: "Насос-Сервіс", document: "Акт №8", fund: "Поточний" },
  { date: "24.04.2026", category: "Освітлення", amount: 15400, contractor: "LED Майстер", document: "Накладна", fund: "Спецфонд" },
];

const projectsData = [
  { name: "Пожежні проїзди", category: "Безпека", budget: 420000, collected: 146000, spent: 0, status: "Збір коштів", priority: "Критичний" },
  { name: "Аудит електромереж", category: "Електрика", budget: 65000, collected: 65000, spent: 38000, status: "В роботі", priority: "Високий" },
  { name: "Сміттєвий майданчик", category: "Санітарія", budget: 95000, collected: 31000, spent: 0, status: "План", priority: "Середній" },
  { name: "Ремонт центральної дороги", category: "Дороги", budget: 780000, collected: 188000, spent: 18500, status: "Кошторис", priority: "Високий" },
];

const requestsData = [
  { id: 1, plot: 44, title: "Немає вивозу сміття третій тиждень", category: "Сміття", status: "Нове", priority: "Високий" },
  { id: 2, plot: 126, title: "Провисає електролінія біля ділянки", category: "Електрика", status: "В роботі", priority: "Критичний" },
  { id: 3, plot: 219, title: "Після дощу стоїть вода на проїзді", category: "Дренаж", status: "На розгляді", priority: "Середній" },
  { id: 4, plot: 331, title: "Потрібна заміна лампи освітлення", category: "Освітлення", status: "Виконано", priority: "Низький" },
];

const monthlyData = [
  { month: "Січ", paid: 76000, charged: 118000 },
  { month: "Лют", paid: 92000, charged: 118000 },
  { month: "Бер", paid: 126000, charged: 148000 },
  { month: "Кві", paid: 164000, charged: 172000 },
  { month: "Тра", paid: 142000, charged: 172000 },
  { month: "Чер", paid: 188000, charged: 205000 },
];

function runSelfTests() {
  const plots = buildPlots();
  console.assert(plots.length === 344, "Expected 344 plots");
  console.assert(plots[0].line === "LINE_1", "Plot 1 should be LINE_1");
  console.assert(plots[33].line === "LINE_2", "Plot 34 should be LINE_2");
  console.assert(plots[101].line === "LINE_3", "Plot 102 should be LINE_3");
  console.assert(plots[170].line === "LINE_3", "Plot 171 should be LINE_3");
  console.assert(plots[241].line === "LINE_5", "Plot 242 should be LINE_5");
  console.assert(plots[343].line === "LINE_1", "Plot 344 should be LINE_1");
  console.assert(plots.every((plot) => plot.status === "paid" || plot.status === "partial" || plot.status === "debt"), "Every plot should have a valid status");
}
runSelfTests();

const money = (value) => `${new Intl.NumberFormat("uk-UA").format(value)} грн`;
const cls = (...parts) => parts.filter(Boolean).join(" ");

function Card({ children, className = "" }) {
  return <div className={cls("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    purple: "bg-violet-50 text-violet-700 ring-violet-200",
  };
  return <span className={cls("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", tones[tone] || tones.slate)}>{children}</span>;
}

function Stat({ title, value, icon, tone = "blue", delta }) {
  const bg = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-violet-50 text-violet-700",
  }[tone] || "bg-blue-50 text-blue-700";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {delta ? <p className="mt-1 text-xs text-slate-500">{delta}</p> : null}
        </div>
        <div className={cls("rounded-2xl p-3", bg)}>
          <Icon name={icon} size={22} />
        </div>
      </div>
    </Card>
  );
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const items = [
    { id: "dashboard", label: "Дашборд", icon: "home" },
    { id: "map", label: "Мапа ділянок", icon: "map" },
    { id: "plots", label: "Ділянки", icon: "users" },
    { id: "payments", label: "Внески та оплати", icon: "wallet" },
    { id: "expenses", label: "Витрати", icon: "receipt" },
    { id: "projects", label: "Проєкти", icon: "folder" },
    { id: "requests", label: "Звернення", icon: "file" },
  ];

  return (
    <aside className={cls("fixed inset-y-0 left-0 z-30 w-80 transform border-r border-slate-200 bg-white p-5 transition-transform lg:static lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-blue-800 to-emerald-500 p-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] opacity-80">Demo MVP</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">СТ «Академік»</h1>
        <p className="mt-2 text-sm opacity-90">Система прозорого обліку та розвитку товариства</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActive(item.id);
                setMobileOpen(false);
              }}
              className={cls(
                "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className="flex items-center gap-3"><Icon name={item.icon} size={19} />{item.label}</span>
              {isActive ? <Icon name="chevron" size={17} /> : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-bold text-slate-900">Режим демо</p>
        <p className="mt-1">Дані тестові. Логіка показує, як може працювати реальна система після імпорту реєстрів.</p>
      </div>
    </aside>
  );
}

function PlotDrawer({ plot, onClose }) {
  if (!plot) return null;
  const totalDebt = plot.debt + plot.electricDebt;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ x: 380 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        onClick={(event) => event.stopPropagation()}
        className="ml-auto h-full w-full max-w-md overflow-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Картка ділянки</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">№{plot.plotNumber}</h2>
            <p className="text-sm text-slate-500">{streets.find((street) => street.id === plot.line)?.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><Icon name="close" size={22} /></button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Статус</p>
            <div className="mt-2"><Badge tone={plot.status === "paid" ? "green" : plot.status === "partial" ? "amber" : "red"}>{plot.status === "paid" ? "Оплачено" : plot.status === "partial" ? "Частково" : "Борг"}</Badge></div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Загальний борг</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{money(totalDebt)}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            ["Власник / член", plot.owner],
            ["Телефон", plot.phone],
            ["Площа", `${plot.area} га`],
            ["Членство", plot.membership],
            ["Борг по внесках", money(plot.debt)],
            ["Борг по електриці", money(plot.electricDebt)],
            ["Остання оплата", plot.lastPayment],
            ["Примітка", plot.note || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="max-w-[220px] text-right text-sm font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-blue-50 p-4">
          <p className="font-bold text-blue-900">Наступні дії</p>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>• сформувати квитанцію;</li>
            <li>• додати оплату;</li>
            <li>• створити звернення;</li>
            <li>• переглянути історію змін.</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Dashboard({ plots, setActive }) {
  const totalDebt = plots.reduce((sum, plot) => sum + plot.debt + plot.electricDebt, 0);
  const paid = plots.filter((plot) => plot.status === "paid").length;
  const debtors = plots.length - paid;
  const critical = requestsData.filter((request) => request.priority === "Критичний" || request.priority === "Високий").length;

  const pie = [
    { name: "Оплачено", value: paid, color: "#10b981" },
    { name: "Борг", value: debtors, color: "#ef4444" },
    { name: "Неоформлено", value: plots.filter((plot) => plot.membership !== "активний").length, color: "#f59e0b" },
  ];

  return (
    <div>
      <SectionTitle title="Головний дашборд" subtitle="Оперативний стан СТ: внески, борги, витрати, проєкти та критичні звернення." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Ділянок у системі" value="344" icon="map" tone="blue" delta="6 ліній / вулиць" />
        <Stat title="Загальний борг" value={money(totalDebt)} icon="alert" tone="red" delta={`${debtors} ділянок мають борг`} />
        <Stat title="Оплачено у квітні" value={money(164000)} icon="wallet" tone="green" delta="95% від плану місяця" />
        <Stat title="Критичні питання" value={critical} icon="shield" tone="amber" delta="потребують реакції правління" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Нараховано / сплачено</h3>
              <p className="text-sm text-slate-500">Помесячна динаміка для контролю касового розриву</p>
            </div>
            <Badge tone="blue">2026</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => money(value)} />
                <Bar dataKey="charged" name="Нараховано" radius={[8, 8, 0, 0]} fill="#93c5fd" />
                <Bar dataKey="paid" name="Сплачено" radius={[8, 8, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-bold text-slate-900">Статус ділянок</h3>
          <p className="text-sm text-slate-500">Оплати та проблемні картки</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={58} outerRadius={90} paddingAngle={4}>
                  {pie.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {pie.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: item.color }} />{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Критичні напрями</h3>
            <button type="button" onClick={() => setActive("projects")} className="text-sm font-semibold text-blue-700 hover:text-blue-900">до проєктів</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["zap", "Електрика", "старий трансформатор, втрати, аварійність", "red"],
              ["truck", "Сміття", "немає стабільного графіка вивозу", "amber"],
              ["water", "Вода", "2 свердловини, потрібна ревізія", "blue"],
              ["shield", "Пожежні проїзди", "потрібні 3,5 м і розвороти", "red"],
            ].map(([icon, title, text, tone]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={cls("rounded-2xl p-2", tone === "red" ? "bg-rose-50 text-rose-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700")}><Icon name={icon} size={20} /></div>
                  <p className="font-bold text-slate-900">{title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Останні витрати</h3>
          <div className="space-y-3">
            {expensesData.slice(0, 4).map((expense) => (
              <div key={`${expense.date}-${expense.amount}`} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3">
                <div>
                  <p className="font-semibold text-slate-900">{expense.category}</p>
                  <p className="text-xs text-slate-500">{expense.contractor} · {expense.date}</p>
                </div>
                <p className="font-bold text-slate-900">{money(expense.amount)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MapView({ plots, selectedLine, setSelectedLine, setSelectedPlot }) {
  const visible = plots.filter((plot) => selectedLine === "ALL" || plot.line === selectedLine);
  const byLine = streets.map((street) => ({ ...street, plots: plots.filter((plot) => plot.line === street.id) }));

  return (
    <div>
      <SectionTitle
        title="Мапа ділянок"
        subtitle="Клік по ділянці відкриває картку. Колір показує статус оплат і ризиків. Це демо-схема, не кадастровий план."
        action={
          <select value={selectedLine} onChange={(event) => setSelectedLine(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            <option value="ALL">Усі лінії</option>
            {streets.map((street) => <option key={street.id} value={street.id}>{street.name}</option>)}
          </select>
        }
      />

      <Card className="mb-5 p-5">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500" />Оплачено</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-amber-400" />Частково</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-rose-500" />Борг</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-300" />Немає даних</span>
        </div>
      </Card>

      <div className="space-y-5">
        {byLine.filter((line) => selectedLine === "ALL" || line.id === selectedLine).map((line) => (
          <Card key={line.id} className="p-5">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{line.name}</h3>
                <p className="text-sm text-slate-500">Ділянки: {line.range}</p>
              </div>
              <div className="flex gap-2">
                <Badge tone="green">{line.plots.filter((plot) => plot.status === "paid").length} оплачено</Badge>
                <Badge tone="red">{line.plots.filter((plot) => plot.status === "debt").length} борг</Badge>
              </div>
            </div>
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-12 md:grid-cols-16 xl:grid-cols-18">
              {line.plots.map((plot) => (
                <button
                  key={plot.id}
                  type="button"
                  onClick={() => setSelectedPlot(plot)}
                  className={cls(
                    "aspect-square rounded-xl text-xs font-bold text-white shadow-sm transition hover:scale-110 hover:shadow-lg",
                    plot.status === "paid" ? "bg-emerald-500" : plot.status === "partial" ? "bg-amber-400" : "bg-rose-500"
                  )}
                  title={`Ділянка ${plot.plotNumber}`}
                >
                  {plot.plotNumber}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">Показано ділянок: {visible.length}</p>
    </div>
  );
}

function PlotsTable({ plots, search, setSearch, selectedLine, setSelectedLine, setSelectedPlot }) {
  const filtered = plots.filter((plot) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || String(plot.plotNumber).includes(query) || plot.owner.toLowerCase().includes(query) || plot.phone.includes(query);
    const matchesLine = selectedLine === "ALL" || plot.line === selectedLine;
    return matchesSearch && matchesLine;
  });

  return (
    <div>
      <SectionTitle title="Реєстр ділянок" subtitle="Пошук, фільтрація, статус членства, борги і швидкий доступ до картки ділянки." />
      <Card className="mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук за номером, ПІБ або телефоном" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none ring-blue-100 focus:ring-4" />
          </div>
          <select value={selectedLine} onChange={(event) => setSelectedLine(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            <option value="ALL">Усі лінії</option>
            {streets.map((street) => <option key={street.id} value={street.id}>{street.name}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Ділянка</th>
                <th className="px-5 py-4">Лінія</th>
                <th className="px-5 py-4">Власник</th>
                <th className="px-5 py-4">Членство</th>
                <th className="px-5 py-4">Внески</th>
                <th className="px-5 py-4">Електрика</th>
                <th className="px-5 py-4">Статус</th>
                <th className="px-5 py-4">Дія</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 60).map((plot) => (
                <tr key={plot.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-900">№{plot.plotNumber}</td>
                  <td className="px-5 py-4 text-slate-600">{streets.find((street) => street.id === plot.line)?.name}</td>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900">{plot.owner}</p><p className="text-xs text-slate-500">{plot.phone}</p></td>
                  <td className="px-5 py-4"><Badge tone={plot.membership === "активний" ? "green" : "amber"}>{plot.membership}</Badge></td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{money(plot.debt)}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{money(plot.electricDebt)}</td>
                  <td className="px-5 py-4"><Badge tone={plot.status === "paid" ? "green" : plot.status === "partial" ? "amber" : "red"}>{plot.status === "paid" ? "ОК" : plot.status === "partial" ? "Частково" : "Борг"}</Badge></td>
                  <td className="px-5 py-4"><button type="button" onClick={() => setSelectedPlot(plot)} className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100">Відкрити</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 p-4 text-sm text-slate-500">Показано {Math.min(filtered.length, 60)} з {filtered.length}. У реальній системі буде пагінація та експорт.</div>
      </Card>
    </div>
  );
}

function Payments({ plots }) {
  const debtByLine = streets.map((street) => ({
    name: street.name,
    debt: plots.filter((plot) => plot.line === street.id).reduce((sum, plot) => sum + plot.debt + plot.electricDebt, 0),
  }));

  return (
    <div>
      <SectionTitle
        title="Внески та оплати"
        subtitle="Нарахування, фіксація оплат, борги по лініях і підготовка звітів для зборів."
        action={<button type="button" className="rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800">+ Додати оплату</button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="Нараховано за квітень" value={money(172000)} icon="wallet" tone="blue" />
        <Stat title="Сплачено за квітень" value={money(164000)} icon="check" tone="green" />
        <Stat title="Поточний борг" value={money(plots.reduce((sum, plot) => sum + plot.debt + plot.electricDebt, 0))} icon="alert" tone="red" />
      </div>

      <Card className="mt-5 p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Борг по лініях</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={debtByLine}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="debt" name="Борг" radius={[8, 8, 0, 0]} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-5 overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-900">Останні оплати</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {plots.filter((plot) => plot.status === "paid").slice(0, 8).map((plot) => (
            <div key={plot.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-slate-900">Ділянка №{plot.plotNumber} · {plot.owner}</p>
                <p className="text-sm text-slate-500">Членський внесок · {plot.lastPayment}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="green">Зараховано</Badge>
                <span className="font-bold text-slate-900">{money(500)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Expenses() {
  const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div>
      <SectionTitle
        title="Витрати"
        subtitle="Кожна витрата має категорію, підставу, фонд, контрагента і документ."
        action={<button type="button" className="rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800">+ Додати витрату</button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="Витрачено за квітень" value={money(total)} icon="receipt" tone="red" />
        <Stat title="Документів додано" value="5" icon="file" tone="blue" />
        <Stat title="Спецфонд" value={money(127000)} icon="shield" tone="green" />
      </div>
      <Card className="mt-5 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-4">Дата</th><th className="px-5 py-4">Категорія</th><th className="px-5 py-4">Сума</th><th className="px-5 py-4">Контрагент</th><th className="px-5 py-4">Документ</th><th className="px-5 py-4">Фонд</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expensesData.map((expense) => (
                <tr key={`${expense.date}-${expense.amount}`} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{expense.date}</td>
                  <td className="px-5 py-4"><Badge tone="blue">{expense.category}</Badge></td>
                  <td className="px-5 py-4 font-bold text-slate-900">{money(expense.amount)}</td>
                  <td className="px-5 py-4 text-slate-600">{expense.contractor}</td>
                  <td className="px-5 py-4 text-slate-600">{expense.document}</td>
                  <td className="px-5 py-4"><Badge tone={expense.fund === "Спецфонд" ? "purple" : "slate"}>{expense.fund}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Projects() {
  return (
    <div>
      <SectionTitle
        title="Проєкти розвитку"
        subtitle="Цільові фонди, бюджети, статуси та контроль виконання робіт."
        action={<button type="button" className="rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800">+ Новий проєкт</button>}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {projectsData.map((project) => {
          const progress = Math.round((project.collected / project.budget) * 100);
          const spent = Math.round((project.spent / project.budget) * 100);
          return (
            <Card key={project.name} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={project.priority === "Критичний" ? "red" : project.priority === "Високий" ? "amber" : "blue"}>{project.priority}</Badge>
                    <Badge>{project.category}</Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-black text-slate-900">{project.name}</h3>
                  <p className="text-sm text-slate-500">Статус: {project.status}</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><Icon name="folder" size={28} /></div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Бюджет</p><p className="font-bold">{money(project.budget)}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Зібрано</p><p className="font-bold">{money(project.collected)}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Витрачено</p><p className="font-bold">{money(project.spent)}</p></div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm"><span className="text-slate-500">Збір коштів</span><strong>{progress}%</strong></div>
                <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm"><span className="text-slate-500">Освоєння бюджету</span><strong>{spent}%</strong></div>
                <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-blue-600" style={{ width: `${spent}%` }} /></div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Requests() {
  return (
    <div>
      <SectionTitle
        title="Звернення членів СТ"
        subtitle="Єдиний канал для проблем по дорогах, електриці, воді, сміттю, платежах і документах."
        action={<button type="button" className="rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800">+ Створити звернення</button>}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Усього звернень" value={requestsData.length} icon="file" tone="blue" />
        <Stat title="Критичних" value="1" icon="alert" tone="red" />
        <Stat title="В роботі" value="1" icon="shield" tone="amber" />
        <Stat title="Виконано" value="1" icon="check" tone="green" />
      </div>
      <div className="mt-5 space-y-3">
        {requestsData.map((request) => (
          <Card key={request.id} className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={request.priority === "Критичний" ? "red" : request.priority === "Високий" ? "amber" : request.priority === "Середній" ? "blue" : "slate"}>{request.priority}</Badge>
                  <Badge>{request.category}</Badge>
                  <Badge tone={request.status === "Виконано" ? "green" : request.status === "В роботі" ? "amber" : "blue"}>{request.status}</Badge>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{request.title}</h3>
                <p className="text-sm text-slate-500">Ділянка №{request.plot}</p>
              </div>
              <button type="button" className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">Відкрити</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function STAkademikDemoApp() {
  const [active, setActive] = useState("dashboard");
  const [selectedLine, setSelectedLine] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const plots = useMemo(() => allPlots, []);

  const content = {
    dashboard: <Dashboard plots={plots} setActive={setActive} />,
    map: <MapView plots={plots} selectedLine={selectedLine} setSelectedLine={setSelectedLine} setSelectedPlot={setSelectedPlot} />,
    plots: <PlotsTable plots={plots} search={search} setSearch={setSearch} selectedLine={selectedLine} setSelectedLine={setSelectedLine} setSelectedPlot={setSelectedPlot} />,
    payments: <Payments plots={plots} />,
    expenses: <Expenses />,
    projects: <Projects />,
    requests: <Requests />,
  }[active];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {mobileOpen ? <div className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
      <div className="lg:flex">
        <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="min-w-0 flex-1 p-4 lg:p-8">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-2xl bg-white p-3 shadow-sm"><Icon name="menu" /></button>
            <div className="text-right">
              <p className="text-sm font-black">СТ «Академік»</p>
              <p className="text-xs text-slate-500">Demo MVP</p>
            </div>
          </div>

          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            {content}
          </motion.div>
        </main>
      </div>
      <PlotDrawer plot={selectedPlot} onClose={() => setSelectedPlot(null)} />
    </div>
  );
}
