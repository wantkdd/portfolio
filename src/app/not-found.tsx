import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span>404</span>
      <h1>A little detour.</h1>
      <p>
        찾으시는 페이지가 없어요.
        <br />
        프로젝트 목록에서 다시 만나볼까요?
      </p>
      <Link href="/" className="button primary">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
