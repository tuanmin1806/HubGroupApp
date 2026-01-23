import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import DefaultImage from "../../assets/default_organization_card.jpg";

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

function SelectActionCard() {
  const [selectedCard, setSelectedCard] = React.useState(0);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 2,
      }}
    >
      {cards.map((card, index) => (
        <Card key={card.id}>
          <CardActionArea
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              sx={{
                width: { xs: 96, sm: 120 },
                height: '100%',
                objectFit: 'contain',
              }}
            />

            <CardContent
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {card.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {card.description}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'right' }}
              >
                {card.location}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default SelectActionCard;
