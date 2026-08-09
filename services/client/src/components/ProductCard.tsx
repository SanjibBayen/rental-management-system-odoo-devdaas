import { useState, useCallback, useMemo, memo } from "react";
import { Product } from "../types";
import { Star, ShoppingCart, Check, Package, ImageOff } from "lucide-react";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product;
  setActiveView?: (view: string) => void;
  onProductClick?: (productId: string) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  setActiveView,
  onProductClick,
}: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  // Check if product is already in cart
  const productInCart = items.some((item) => item.id === product.id);
  const stockQuantity = product.stockQuantity ?? 0;

  // Check if product is out of stock
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  // Determine badge with proper logic
  const displayBadge = useMemo(() => {
    if (isOutOfStock) {
      return { text: "Out of Stock", type: "error" as const };
    }
    if (isLowStock) {
      return { text: `Only ${stockQuantity} left`, type: "warning" as const };
    }
    if (product.rating > 4.5) {
      return { text: "Top Recommended", type: "success" as const };
    }
    return product.badge || null;
  }, [product.rating, product.badge, isOutOfStock, isLowStock, stockQuantity]);

  // Memoize badge styles
  const badgeStyle = useMemo(() => {
    if (!displayBadge) return "";

    const styles = {
      success: "bg-success-teal text-white",
      info: "bg-primary text-white",
      warning: "bg-warning-amber text-white",
      error: "bg-danger-red text-white",
      default: "bg-surface-dim text-on-surface",
    };

    return styles[displayBadge.type] || styles.default;
  }, [displayBadge]);

  // Format price with Indian number system
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Handle adding to cart with feedback
  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (isOutOfStock || isAddingToCart) return;

      setIsAddingToCart(true);

      try {
        await addToCart(product);

        // Show success feedback
        setShowAddedFeedback(true);
        setTimeout(() => setShowAddedFeedback(false), 2000);
      } catch (error) {
        console.error("Failed to add to cart:", error);
        // Could show error toast here
      } finally {
        setIsAddingToCart(false);
      }
    },
    [product, addToCart, isOutOfStock, isAddingToCart],
  );

  // Handle rent now action
  const handleRentNow = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (isOutOfStock || isRenting) return;

      setIsRenting(true);

      try {
        // Only add to cart if not already there
        if (!productInCart) {
          await addToCart(product);
        }

        // Navigate to cart
        if (setActiveView) {
          setActiveView("cart");
        }
      } catch (error) {
        console.error("Failed to process rental:", error);
        // Could show error toast here
      } finally {
        setIsRenting(false);
      }
    },
    [product, addToCart, setActiveView, productInCart, isOutOfStock, isRenting],
  );

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    },
    [product.id],
  );

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  }, [product.id, onProductClick]);

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick],
  );

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-full 
        transition-all duration-300 cursor-pointer
        ${isOutOfStock ? "opacity-75" : "hover:shadow-md hover:border-primary"}
        ${isOutOfStock ? "border-border-standard" : "border-border-standard group"}
      `}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${product.name} by ${product.brand}, ${formatPrice(product.pricePerDay)} per day`}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full bg-surface-container-low overflow-hidden flex items-center justify-center p-4">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-surface-container-low animate-pulse flex items-center justify-center">
            <Package className="w-12 h-12 text-outline/30" />
          </div>
        )}

        {/* Product Image */}
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain transition-all duration-500 ${
              imageLoaded
                ? "opacity-100 group-hover:scale-105"
                : "opacity-0 scale-95"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Fallback for broken images */
          <div className="flex flex-col items-center justify-center text-outline">
            <ImageOff className="w-12 h-12 mb-2" />
            <span className="text-xs">Image not available</span>
          </div>
        )}

        {/* Badges */}
        {displayBadge && (
          <div
            className={`absolute top-3 left-3 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm z-10 ${badgeStyle}`}
          >
            {displayBadge.text}
          </div>
        )}

        {/* Stock Status Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-danger-red font-bold text-sm px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Brand */}
        <div className="text-outline font-bold text-[11px] uppercase tracking-wider mb-1">
          {product.brand || "Generic"}
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-lg text-on-surface mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-5">
          <Star className="w-4 h-4 fill-warning-amber text-warning-amber" />
          <span className="font-bold text-sm text-on-surface">
            {product.rating?.toFixed(1) || "N/A"}
          </span>
          <span className="font-medium text-xs text-outline">
            ({product.reviewsCount || 0} reviews)
          </span>
        </div>

        {/* Price and Actions */}
        <div className="mt-auto flex items-end justify-between pt-4 border-t border-border-standard">
          <div>
            <div className="font-medium text-xs text-outline mb-0.5">
              {product.pricePerDay > 0 ? "Starting at" : "Free"}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-2xl text-primary">
                {product.pricePerDay > 0
                  ? formatPrice(product.pricePerDay)
                  : "Free"}
              </span>
              {product.pricePerDay > 0 && (
                <span className="font-medium text-sm text-outline">/day</span>
              )}
            </div>

            {/* Stock Indicator */}
            {isLowStock && !isOutOfStock && (
              <p className="text-xs text-warning-amber font-medium mt-1">
                Only {product.stockQuantity} left in stock
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className={`
                font-bold p-2.5 rounded-lg transition-all duration-200 shadow-sm
                flex items-center justify-center
                ${
                  productInCart || showAddedFeedback
                    ? "bg-success-teal text-white border border-success-teal"
                    : "bg-surface-muted text-primary border border-primary/20 hover:bg-primary/10"
                }
                ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isAddingToCart ? "animate-pulse" : ""}
              `}
              title={productInCart ? "Added to cart" : "Add to Cart"}
              aria-label={
                productInCart
                  ? "Already in cart"
                  : showAddedFeedback
                    ? "Added to cart"
                    : "Add to cart"
              }
            >
              {productInCart || showAddedFeedback ? (
                <Check className="w-5 h-5" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>

            {/* Rent Now Button */}
            <button
              onClick={handleRentNow}
              disabled={isOutOfStock || isRenting}
              className={`
                text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm
                ${
                  isOutOfStock
                    ? "bg-surface-dim cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark active:scale-95 cursor-pointer"
                }
                ${isRenting ? "opacity-75" : ""}
              `}
              aria-label={isOutOfStock ? "Out of stock" : "Rent now"}
            >
              {isRenting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Rent Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
