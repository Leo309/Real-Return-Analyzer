// 简体中文翻译
export const zh = {
  common: {
    back: '返回',
    next: '下一步',
    calculate: '计算',
    selectRegion: '选择您的地区',
    selectInvestment: '选择投资类型',
    years: '年',
    dataAvailable: '数据可用',
    from: '从',
    to: '到',
    submit: '提交',
    feedback: '反馈',
    feedbackThankYou: '感谢您的反馈！',
    loading: '加载中...',
    error: '发生错误',
  },
  regionSelector: {
    title: '您在哪里投资？',
    subtitle: '选择您的地区，开始使用特定地区的投资数据',
    dataYearsLabel: '{startYear}-{endYear}',
    dataCompleteness: {
      full: '完整数据',
      partial: '部分数据',
      limited: '有限数据'
    }
  },
  investmentSelector: {
    title: '选择您的投资类型',
    subtitle: '查看不同的投资策略在以下地区的表现',
    availableYears: '{years} 年数据 ({startYear}-{endYear})',
    dataNote: '数据覆盖说明',
    selectButton: '选择此投资',
    backToRegions: '更改地区',
    historicalReturn: '平均历史回报率: {returnRate}%'
  },
  calculator: {
    title: '真实回报分析器',
    subtitle: '了解通胀和投资如何影响您的资金随时间的变化',
    initialAmount: '初始金额',
    startYear: '开始年份',
    endYear: '结束年份',
    inflationImpact: '通胀影响',
    investmentPerformance: '投资表现',
    originalAmount: '原始金额',
    trueValueToday: '今日真实价值',
    withInvestmentReturns: '包含投资回报',
    realGrowthAfterInflation: '通胀后实际增长',
    calculateButton: '计算',
    backToInvestments: '更改投资类型',
    moneyLostToInflation: '通胀损失',
    changeInPurchasingPower: '购买力变化',
    nominalGrowth: '名义增长',
    realGrowth: '实际增长',
    customRate: '自定义年回报率 (%)',
    customRateHint: '输入您自定义投资的预期年回报率',
    results: '计算结果',
    inflationReducedPurchasingPower: '即使有投资，通胀仍使您的购买力减少了 {percentage}%'
  },
  feedback: {
    title: '帮助我们改进',
    emailLabel: '您的邮箱（可选）',
    messageLabel: '您的反馈',
    ratingLabel: '您如何评价您的体验？',
    submitButton: '提交反馈',
    placeholder: '告诉我们您对计算器的看法...',
    thankYou: '感谢您的反馈！'
  },
  investmentTypes: {
    none: {
      name: '无投资',
      description: '仅查看通胀影响，不包含任何投资回报',
    },
    cash: {
      name: '银行定存',
      description: '低风险银行定期存款账户，波动性最小',
    },
    bonds: {
      name: '政府债券',
      description: '10年期政府债券，中等风险，通常比现金回报更高',
    },
    stocks: {
      name: '股票市场',
      description: '广泛的股票市场指数，风险较高但长期回报潜力更大',
    },
    realEstate: {
      name: '房地产',
      description: '住宅房产价格指数，显示平均房产市场表现',
    },
    custom: {
      name: '自定义利率',
      description: '定义您自己的年回报率来比较自定义投资方案',
    }
  },
  seo: {
    title: '投资计算器 | 历史回报与通胀影响',
    description: '计算通胀和投资如何影响您的资金随时间变化。基于历史数据比较股票、债券、房地产等。',
    keywords: '投资计算器, 通胀计算器, 股票回报, 债券回报, 房地产投资, 历史回报, 理财规划'
  }
};