
export default function Footer() {
  return (
    <footer className="border-t border-[#e4eae5] bg-[#fbfdfb]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-[12px] text-[#26352a] sm:flex-row sm:gap-4 sm:text-left">
        <p>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
