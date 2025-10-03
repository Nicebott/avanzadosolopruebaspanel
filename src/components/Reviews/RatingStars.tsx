import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  darkMode?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 10,
  size = 'md',
  interactive = false,
  onChange,
  darkMode = false,
}) => {
  const starSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const starSize = starSizes[size];
  const totalStars = 5;
  const normalizedRating = (rating / maxRating) * totalStars;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        const fillPercentage = Math.min(Math.max(normalizedRating - index, 0), 1);
        const isFilled = fillPercentage >= 0.5;
        const starValue = interactive ? Math.ceil(((starNumber / totalStars) * maxRating)) : 0;

        return (
          <motion.div
            key={index}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            className={interactive ? 'cursor-pointer' : ''}
            onClick={() => interactive && onChange?.(starValue)}
          >
            <Star
              size={starSize}
              className={`${
                isFilled
                  ? 'text-yellow-400 fill-current'
                  : darkMode
                    ? 'text-gray-600'
                    : 'text-gray-300'
              } transition-colors duration-200`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default RatingStars;