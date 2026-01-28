import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DefaultImage from "../../assets/default_organization_card.jpg";
import Popover from '@mui/material/Popover';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

const cards = [
  {
    id: 1,
    title: 'Plants',
    description: 'Plants are essential for all life.',
    image: DefaultImage,
    location: 'Earth',
  },
  {
    id: 2,
    title: 'Animals',
    description: 'Animals are a part of nature.',
    image: DefaultImage,
    location: 'Earth',
  },
  {
    id: 3,
    title: 'Humans',
    description: 'Humans depend on plants and animals for survival.',
    image: DefaultImage,
    location: 'Earth',
  },
  {
    id: 4,
    title: 'Humans',
    description: 'Humans depend on plants and animals for survival.',
    image: DefaultImage,
    location: 'Earth',
  },
  {
    id: 5,
    title: 'Humans',
    description: 'Humans depend on plants and animals for survival.',
    image: DefaultImage,
    location: 'Earth',
  },
];

export default function SelectActionCard() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedCard, setSelectedCard] = React.useState<typeof cards[0] | null>(null);
  const navigate = useNavigate();

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>,
    card: typeof cards[0]
  ) => {
    const cardElement = event.currentTarget.closest('.MuiCard-root');
    setAnchorEl(cardElement as HTMLElement);
    setSelectedCard(card);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  }

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 2,
        }}
      >
        {cards.map((card) => (
          <Card key={card.id}>
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              sx={{
                width: '100%',
                height: 140,
                objectFit: 'cover',
              }}
            />

            <CardContent>
              <Typography onClick={() => handleNavigate('/chi-tiet-tuyen-sinh')} variant="h6">{card.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {card.location}
              </Typography>

              <Box mt={2}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => handleOpen(e, card)}
                >
                  Xem chi tiết
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {selectedCard && (
          <Box sx={{ p: 2, maxWidth: 260 }}>
            <Box
              component="img"
              src={selectedCard.image}
              alt={selectedCard.title}
              sx={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 1,
              }}
            />
            <Typography variant="subtitle1" gutterBottom>
              {selectedCard.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedCard.description}
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}
