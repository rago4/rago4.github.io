import { useArticles } from "../hooks/use-articles";
import { Article } from "./article";
import books from "../books.json";
import { Book } from "./book";

export function Main() {
  const articles = useArticles();

  return (
    <main>
      <section className="mb-4">
        <h2 className="mb-1 text-xl font-semibold text-slate-800">
          About me 💁‍♂️
        </h2>
        <p className="leading-relaxed text-slate-600">
          My name is Rafał, and I'm a front-end developer based in{" "}
          <a
            className="text-blue-500 hover:underline"
            href="https://goo.gl/maps/sCNU2us2ibKd8VRQA"
          >
            Lublin, Poland
          </a>
          . On a daily basis, I'm working mostly with React and TypeScript, but
          I'm also an enthusiast of other technologies like Next or Remix.
          Besides coding, I enjoy brewing coffee, cooking and reading books.
        </p>
      </section>
      {articles.length > 0 ? (
        <section className="mb-4">
          <h2 className="mb-1 text-xl font-semibold text-slate-800">Blog 📝</h2>
          <p className="mb-2 leading-relaxed text-slate-600">
            I'm running a blog on a{" "}
            <a
              className="text-blue-500 hover:underline"
              href="https://dev.to/rgolawski"
            >
              dev.to
            </a>{" "}
            platform. Below you can find a list of my recent posts.
          </p>
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article.id}>
                <Article data={article} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="mb-4">
        <h2 className="mb-1 text-xl font-semibold text-slate-800">
          Bookshelf 📚
        </h2>
        <p className="mb-2 leading-relaxed text-slate-600">
          Reading is one of my favourite activities. Here's the list of books
          that I recently read, rated in a 5-star scale. If you're into reading
          as well - follow me on{" "}
          <a
            className="text-blue-500 hover:underline"
            href="https://www.goodreads.com/user/show/115275908-rafal-golawski"
          >
            goodreads
          </a>
          .
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {books.map((book) => (
            <li key={book.title}>
              <Book data={book} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
