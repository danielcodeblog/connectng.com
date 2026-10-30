import React from 'react';

interface CommunitySpotlightProps {
  onOpenCharter?: () => void;
  onAnswerDailyPrompt: (promptText: string) => void;
  onMessageFellow?: (authorId: string) => void;
  isPledged?: boolean;
}

export const CommunitySpotlight: React.FC<CommunitySpotlightProps> = () => {
  return null;
};

