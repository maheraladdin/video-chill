export function Content({
  sections,
}: {
  sections: { title: string; content: string }[];
}) {
  return (
    <div className=" mx-auto mt-16 flex max-w-3xl flex-col gap-6  ">
      {sections.map((section, index) => (
        <div key={index}>
          <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {section.title}
          </h1>
          <p className={"dark:text-gray-400"}>{section.content}</p>
        </div>
      ))}
    </div>
  );
}
