import type {
  Customer,
  CustomerNote,
  CustomerRepository,
} from "@/ports/customer-repository";

const customers: Customer[] = [
  {
    id: "c-001",
    name: "佐藤 美咲",
    nameKana: "さとう みさき",
    company: "株式会社グリーンリーフ",
    department: "経営企画部",
    title: "部長",
    email: "misaki.sato@greenleaf.example",
    phone: "03-6450-2180",
    status: "active",
    owner: "田中",
    lastContactedAt: "2026-10-01",
    nextAction: "10/08 導入プランを送付",
    initials: "SM",
    accent: "mint",
    notes: [
      {
        id: "n-001",
        body: "来期の全社導入に向けて、まず経営企画部でのトライアルを希望。セキュリティチェックシートを先に共有する。",
        createdAt: "2026-10-01",
        author: "田中",
      },
      {
        id: "n-002",
        body: "展示会で名刺交換。業務効率化とレポート機能に関心あり。",
        createdAt: "2026-09-18",
        author: "田中",
      },
    ],
  },
  {
    id: "c-002",
    name: "鈴木 健太",
    nameKana: "すずき けんた",
    company: "ノーススター合同会社",
    department: "営業本部",
    title: "マネージャー",
    email: "kenta.suzuki@northstar.example",
    phone: "06-6123-4072",
    status: "followUp",
    owner: "小林",
    lastContactedAt: "2026-09-28",
    nextAction: "提案内容の社内検討を確認",
    initials: "SK",
    accent: "blue",
    notes: [
      {
        id: "n-003",
        body: "30名規模からのスタートを検討中。見積もりは月額・年額の2パターンを提示済み。",
        createdAt: "2026-09-28",
        author: "小林",
      },
    ],
  },
  {
    id: "c-003",
    name: "高橋 由佳",
    nameKana: "たかはし ゆか",
    company: "株式会社アトリエノート",
    department: "クリエイティブ室",
    title: "室長",
    email: "yuka.takahashi@ateliernote.example",
    phone: "03-5784-9011",
    status: "active",
    owner: "田中",
    lastContactedAt: "2026-09-25",
    nextAction: "活用事例インタビューの日程調整",
    initials: "TY",
    accent: "coral",
    notes: [
      {
        id: "n-004",
        body: "チーム内での利用率が高い。テンプレート共有の運用について次回ヒアリング予定。",
        createdAt: "2026-09-25",
        author: "田中",
      },
    ],
  },
  {
    id: "c-004",
    name: "田中 一郎",
    nameKana: "たなか いちろう",
    company: "光洋テクノロジーズ株式会社",
    department: "情報システム部",
    title: "課長",
    email: "ichiro.tanaka@koyo-tech.example",
    phone: "045-332-1560",
    status: "inactive",
    owner: "山本",
    lastContactedAt: "2026-08-12",
    nextAction: "次期予算策定時期に再連絡",
    initials: "TI",
    accent: "violet",
    notes: [],
  },
  {
    id: "c-005",
    name: "伊藤 直子",
    nameKana: "いとう なおこ",
    company: "MORIYA FOODS",
    department: "事業開発部",
    title: "ディレクター",
    email: "naoko.ito@moriya-foods.example",
    phone: "052-781-4439",
    status: "active",
    owner: "小林",
    lastContactedAt: "2026-10-02",
    nextAction: "契約書ドラフトを法務へ送付",
    initials: "IN",
    accent: "amber",
    notes: [
      {
        id: "n-005",
        body: "PoC結果は好評。11月の本契約を目標に条件を最終調整する。",
        createdAt: "2026-10-02",
        author: "小林",
      },
    ],
  },
  {
    id: "c-006",
    name: "山本 大輔",
    nameKana: "やまもと だいすけ",
    company: "株式会社ブルーハーバー",
    department: "人事部",
    title: "採用責任者",
    email: "daisuke.yamamoto@blueharbor.example",
    phone: "078-221-5708",
    status: "followUp",
    owner: "田中",
    lastContactedAt: "2026-09-20",
    nextAction: "無料トライアルの利用状況を確認",
    initials: "YD",
    accent: "cyan",
    notes: [],
  },
];

const clone = (customer: Customer): Customer => ({
  ...customer,
  notes: customer.notes.map((note) => ({ ...note })),
});

export class InMemoryCustomerRepository implements CustomerRepository {
  private readonly customers = customers.map(clone);

  list(): Customer[] {
    return this.customers.map(clone);
  }

  findById(id: string): Customer | undefined {
    const customer = this.customers.find((item) => item.id === id);
    return customer ? clone(customer) : undefined;
  }

  addNote(customerId: string, note: CustomerNote): Customer {
    const customer = this.customers.find((item) => item.id === customerId);
    if (!customer) {
      throw new Error("顧客が見つかりませんでした。");
    }
    customer.notes.unshift({ ...note });
    return clone(customer);
  }
}
