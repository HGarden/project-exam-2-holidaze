import { Link } from 'react-router-dom';
import Rating from './Rating.jsx';
import PropTypes from 'prop-types';


export default function Card({ venue, to = `/venue/${venue.id}` }) {
  const img = venue.media?.[0]?.url;
  const body = (
    <>
      {img && (
        <figure className="h-44 overflow-hidden">
          <img src={img} alt={venue.media?.[0]?.alt || venue.name} className="w-full h-full object-cover" />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title text-lg md:text-xl">
          {venue.name}
          {typeof venue.price === 'number' && <div className="badge badge-outline">${venue.price}</div>}
        </h2>
        {typeof venue.rating === 'number' && <Rating value={venue.rating} />}
        {venue.location?.city && <p className="text-sm opacity-80">{venue.location.city}, {venue.location.country}</p>}
        {venue.description && <p className="line-clamp-3">{venue.description}</p>}
        <div className="card-actions justify-end">
          <span className="btn btn-primary select-none">View</span>
        </div>
      </div>
    </>
  );

  return to ? (
    <Link to={to} className="card bg-base-100 shadow hover:shadow-lg transition-shadow block border border-base-300">
      {body}
    </Link>
  ) : (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow border border-base-300">
      {body}
    </div>
  );
}

Card.propTypes = {
  venue: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    rating: PropTypes.number,
    description: PropTypes.string,
    media: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string,
    })),
    location: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
    }),
  }).isRequired,
  to: PropTypes.string,
};
