
import Link from "next/link";
import {
  formatPrice,
  toBengaliNumber,
  getUnitBn,
  type Product,
} from "@/lib/utils";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const direction = product.change.dir;

  const changeText =
    direction === "up"
      ? `▲ ${toBengaliNumber(
          Math.abs(product.change.pct).toFixed(1)
        )}%`
      : direction === "down"
        ? `▼ ${toBengaliNumber(
            Math.abs(product.change.pct).toFixed(1)
          )}%`
        : `— ${toBengaliNumber("0.0")}%`;

  const changeColor =
    direction === "up"
      ? "text-[#e33439]"
      : direction === "down"
        ? "text-[#07934b]"
        : "text-[#253128]";

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full min-h-[154px] flex-col justify-between rounded-[17px] border border-[#dfe8e0] bg-[#fbfdfb] p-[17px] transition-all duration-200 hover:border-[#a9d6b5] hover:shadow-[0_5px_16px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b45]"
    >
      {/* Product identity */}
      <div className="flex items-center gap-3">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#f0f5f1] text-[27px]">
          <span aria-hidden="true">{product.image}</span>
        </div>

        <div className="min-w-0">
          <h3 className="text-[17px] leading-[1.35] font-bold text-[#202c23] transition-colors group-hover:text-[#008b45]">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-[13px] leading-5 text-[#38463d]">
            {getUnitBn(product.unit)}
          </p>
        </div>
      </div>

      {/* Today's price and change */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] leading-5 text-[#39483d]">
            আজকের দাম
          </p>

          <p className="text-[21px] leading-[1.3] font-bold text-[#202c23]">
            {formatPrice(product.today)}
            <span className="ml-1 text-[15px] font-medium">
              টাকা
            </span>
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full bg-[#f0f5f1] px-3 py-1 text-[12px] leading-5 font-bold ${changeColor}`}
        >
          {changeText}
        </span>
      </div>
    </Link>
  );
}
