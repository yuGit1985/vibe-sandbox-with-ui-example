"use client";

import { useState } from "react";
import type {
  Customer,
  CustomerRank,
  CustomerStatus,
} from "@/ports/customer-repository";
import type { User } from "@/ports/user-repository";
import {
  BellIcon,
  CalendarIcon,
  ChartIcon,
  ChevronIcon,
  LogoutIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  SparkleIcon,
  UsersIcon,
} from "@/ui/components/icons";
import styles from "./customer-dashboard.module.css";

type Props = {
  user: User;
  customers: Customer[];
  selectedCustomer: Customer | undefined;
  query: string;
  totalCount: number;
  onQueryChange: (query: string) => void;
  onSelectCustomer: (id: string) => void;
  onAddNote: (body: string) => void;
  onSendEmail: (subject: string, body: string) => void;
  logoutAction: () => Promise<void>;
};

const statusLabels: Record<CustomerStatus, string> = {
  active: "商談中",
  followUp: "フォロー",
  inactive: "休眠",
};
const rankClassNames: Record<CustomerRank, string | undefined> = {
  S: styles.rankS,
  A: styles.rankA,
  B: styles.rankB,
};
const formatDate = (date: string) => {
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
};

export function CustomerDashboard({
  user,
  customers,
  selectedCustomer,
  query,
  totalCount,
  onQueryChange,
  onSelectCustomer,
  onAddNote,
  onSendEmail,
  logoutAction,
}: Props) {
  const [note, setNote] = useState("");
  const submitNote = () => {
    if (!note.trim()) return;
    onAddNote(note);
    setNote("");
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>C</span>
          <span>Cliently</span>
        </div>
        <nav aria-label="メインナビゲーション" className={styles.navigation}>
          <p className={styles.navLabel}>ワークスペース</p>
          <a className={styles.navItem} href="#overview">
            <ChartIcon /> 概要
          </a>
          <a
            className={`${styles.navItem} ${styles.navActive}`}
            href="#customers"
          >
            <UsersIcon /> 顧客管理{" "}
            <span className={styles.navCount}>{totalCount}</span>
          </a>
          <a className={styles.navItem} href="#schedule">
            <CalendarIcon /> スケジュール
          </a>
          <p className={styles.navLabel}>管理</p>
          <a className={styles.navItem} href="#settings">
            <SettingsIcon /> 設定
          </a>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userAvatar}>{user.initials}</div>
          <div>
            <strong>{user.displayName}</strong>
            <span>{user.team}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" aria-label="ログアウト" title="ログアウト">
              <LogoutIcon />
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.main} id="customers">
        <header className={styles.topbar}>
          <div className={styles.mobileBrand}>
            <span className={styles.brandMark}>C</span>
            <span>Cliently</span>
          </div>
          <div className={styles.topSearch}>
            <SearchIcon />
            <input
              aria-label="顧客を検索"
              placeholder="顧客名で検索..."
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </div>
          <button className={styles.iconButton} type="button" aria-label="通知">
            <BellIcon />
            <span className={styles.notificationDot} />
          </button>
          <div className={styles.headerAvatar}>{user.initials}</div>
        </header>

        <div className={styles.content}>
          <section className={styles.pageHeading}>
            <div>
              <p className={styles.eyebrow}>CUSTOMER RELATIONSHIP</p>
              <h1>顧客管理</h1>
              <p>顧客との関係を、ひとつの場所で丁寧に。</p>
            </div>
            <div className={styles.summary}>
              <div>
                <span>全顧客</span>
                <strong>{totalCount}</strong>
                <small>社</small>
              </div>
              <div className={styles.summaryDivider} />
              <div>
                <span>今月の接点</span>
                <strong>12</strong>
                <small>件</small>
              </div>
              <div className={styles.trend}>↗ 8.4%</div>
            </div>
          </section>

          <section className={styles.workspace} aria-label="顧客ワークスペース">
            <div className={styles.customerPane}>
              <div className={styles.paneHeader}>
                <div>
                  <h2>顧客一覧</h2>
                  <span>{customers.length}件を表示</span>
                </div>
                <button type="button" className={styles.filterButton}>
                  すべて <span>⌄</span>
                </button>
              </div>
              <div className={styles.mobileSearch}>
                <SearchIcon />
                <input
                  aria-label="顧客名で絞り込み"
                  placeholder="顧客名で検索..."
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                />
              </div>
              <div className={styles.customerList}>
                {customers.map((customer) => (
                  <button
                    type="button"
                    key={customer.id}
                    className={`${styles.customerRow} ${selectedCustomer?.id === customer.id ? styles.selectedRow : ""}`}
                    onClick={() => onSelectCustomer(customer.id)}
                  >
                    <span
                      className={`${styles.avatar} ${styles[customer.accent] ?? ""}`}
                    >
                      {customer.initials}
                    </span>
                    <span className={styles.customerIdentity}>
                      <strong>{customer.name}</strong>
                      <small className={styles.customerMeta}>
                        <span>{customer.company}</span>
                        <span
                          className={`${styles.rankBadge} ${rankClassNames[customer.rank]}`}
                        >
                          {customer.rank}ランク
                        </span>
                      </small>
                    </span>
                    <span
                      className={`${styles.status} ${styles[customer.status]}`}
                    >
                      {statusLabels[customer.status]}
                    </span>
                    <ChevronIcon className={styles.rowChevron} />
                  </button>
                ))}
                {customers.length === 0 && (
                  <div className={styles.emptyState}>
                    <SearchIcon />
                    <strong>該当する顧客がいません</strong>
                    <span>別の名前で検索してみてください。</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.detailPane}>
              {selectedCustomer ? (
                <CustomerDetail
                  key={selectedCustomer.id}
                  customer={selectedCustomer}
                  note={note}
                  onNoteChange={setNote}
                  onSubmitNote={submitNote}
                  onSendEmail={onSendEmail}
                />
              ) : (
                <div className={styles.noSelection}>
                  <UsersIcon />
                  <h2>顧客を選択してください</h2>
                  <p>一覧から顧客を選ぶと詳細が表示されます。</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function CustomerDetail({
  customer,
  note,
  onNoteChange,
  onSubmitNote,
  onSendEmail,
}: {
  customer: Customer;
  note: string;
  onNoteChange: (value: string) => void;
  onSubmitNote: () => void;
  onSendEmail: (subject: string, body: string) => void;
}) {
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sentSubject, setSentSubject] = useState<string>();

  const submitEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    onSendEmail(emailSubject, emailBody);
    setSentSubject(emailSubject.trim());
    setEmailSubject("");
    setEmailBody("");
    setIsEmailComposerOpen(false);
  };

  return (
    <div className={styles.detailContent}>
      <div className={styles.profileHeader}>
        <span
          className={`${styles.profileAvatar} ${styles[customer.accent] ?? ""}`}
        >
          {customer.initials}
        </span>
        <div className={styles.profileTitle}>
          <div>
            <h2>{customer.name}</h2>
            <span className={`${styles.status} ${styles[customer.status]}`}>
              {statusLabels[customer.status]}
            </span>
          </div>
          <p>
            {customer.company} · {customer.department}
          </p>
        </div>
        <button
          className={styles.moreButton}
          type="button"
          aria-label="その他の操作"
        >
          •••
        </button>
      </div>
      {sentSubject && (
        <output className={styles.emailSuccess}>
          <span className={styles.successIcon}>✓</span>
          <span>
            <strong>メールを送信しました</strong>
            <small>
              「{sentSubject}」を {customer.name}さんへ送信しました。
            </small>
          </span>
          <button
            type="button"
            aria-label="送信完了メッセージを閉じる"
            onClick={() => setSentSubject(undefined)}
          >
            ×
          </button>
        </output>
      )}
      <div className={styles.contactGrid}>
        <button
          className={styles.contactCard}
          type="button"
          onClick={() => setIsEmailComposerOpen(true)}
        >
          <span className={styles.contactIcon}>
            <MailIcon />
          </span>
          <span>
            <small>メール</small>
            <strong>{customer.email}</strong>
          </span>
          <span className={styles.contactAction}>作成</span>
        </button>
        <a className={styles.contactCard} href={`tel:${customer.phone}`}>
          <span className={styles.contactIcon}>
            <PhoneIcon />
          </span>
          <span>
            <small>電話番号</small>
            <strong>{customer.phone}</strong>
          </span>
        </a>
      </div>
      <div className={styles.infoStrip}>
        <div>
          <small>顧客ランク</small>
          <strong
            className={`${styles.rankBadge} ${rankClassNames[customer.rank]}`}
          >
            {customer.rank}ランク
          </strong>
        </div>
        <div>
          <small>役職</small>
          <strong>{customer.title}</strong>
        </div>
        <div>
          <small>担当者</small>
          <strong>{customer.owner}</strong>
        </div>
        <div>
          <small>最終接点</small>
          <strong>{formatDate(customer.lastContactedAt)}</strong>
        </div>
      </div>
      <div className={styles.nextAction}>
        <SparkleIcon />
        <span>
          <small>NEXT ACTION</small>
          <strong>{customer.nextAction}</strong>
        </span>
        <button type="button">完了にする</button>
      </div>
      <section className={styles.notesSection}>
        <div className={styles.sectionTitle}>
          <div>
            <h3>メモ</h3>
            <span>{customer.notes.length}</span>
          </div>
          <p>商談の気づきや次のアクションを残せます</p>
        </div>
        <div className={styles.noteComposer}>
          <div className={styles.composerAvatar}>田</div>
          <textarea
            aria-label="新しいメモ"
            placeholder="この顧客についてメモを追加..."
            rows={3}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter")
                onSubmitNote();
            }}
          />
          <div className={styles.composerFooter}>
            <span>⌘ + Enter で追加</span>
            <button
              type="button"
              disabled={!note.trim()}
              onClick={onSubmitNote}
            >
              <SendIcon /> メモを追加
            </button>
          </div>
        </div>
        <div className={styles.notesList}>
          {customer.notes.map((item) => (
            <article key={item.id} className={styles.noteCard}>
              <div className={styles.noteTimeline}>
                <span className={styles.noteDot} />
                <span className={styles.noteLine} />
              </div>
              <div>
                <div className={styles.noteMeta}>
                  <strong>{item.author}</strong>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
          {customer.notes.length === 0 && (
            <p className={styles.noNotes}>
              まだメモはありません。最初の記録を残しましょう。
            </p>
          )}
        </div>
      </section>
      {isEmailComposerOpen && (
        <div className={styles.modalBackdrop}>
          <section
            aria-labelledby="email-composer-title"
            aria-modal="true"
            className={styles.emailModal}
            role="dialog"
          >
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>
                <MailIcon />
              </span>
              <div>
                <h3 id="email-composer-title">メールを作成</h3>
                <p>{customer.name}さんへメッセージを送信します</p>
              </div>
              <button
                type="button"
                aria-label="メール作成画面を閉じる"
                onClick={() => setIsEmailComposerOpen(false)}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitEmail();
              }}
            >
              <label>
                <span>宛先</span>
                <input type="email" value={customer.email} readOnly />
              </label>
              <label>
                <span>件名</span>
                <input
                  required
                  type="text"
                  placeholder="メールの件名を入力"
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                />
              </label>
              <label>
                <span>本文</span>
                <textarea
                  required
                  rows={8}
                  placeholder={`${customer.name}さんへのメッセージを入力...`}
                  value={emailBody}
                  onChange={(event) => setEmailBody(event.target.value)}
                />
              </label>
              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={() => setIsEmailComposerOpen(false)}
                >
                  キャンセル
                </button>
                <button
                  className={styles.sendButton}
                  type="submit"
                  disabled={!emailSubject.trim() || !emailBody.trim()}
                >
                  <SendIcon /> メールを送信
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
