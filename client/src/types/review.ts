export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchases: number;
}

export type ReviewCreateData = {
  bookId: string;
  rating: number;
  title: string;
  content: string;
};

export type ReviewUpdateData = Partial<{
  rating: number;
  title: string;
  content: string;
}>;

export interface ReviewVote {
  id: string;
  reviewId: string;
  userId: string;
  isHelpful: boolean;
}
