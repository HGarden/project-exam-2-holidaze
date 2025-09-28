/* eslint-disable react/prop-types */
export default function Sorting({ sort, setSort, order, setOrder, onChange }) {
  return (
    <div className="flex gap-2 items-center">
      <select className="select select-bordered" value={sort} onChange={(e)=>{ setSort(e.target.value); onChange && onChange(); }} aria-label="Sort field">
        <option value="created">Newest</option>
        <option value="updated">Updated</option>
        <option value="rating">Rating</option>
        <option value="price">Price</option>
      </select>
      <select className="select select-bordered" value={order} onChange={(e)=>{ setOrder(e.target.value); onChange && onChange(); }} aria-label="Sort order">
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );
}
