import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PhotoLibrary from "@mui/icons-material/PhotoLibrary";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

export function FeaturedGallerySidebar({ images }: { images: string[] }) {
    const [selected, setSelected] = useState<string | null>(null);
    if (!images || images.length === 0) return null;

    const MAX_VISIBLE = 3;
    const visibleImages = images.slice(0, MAX_VISIBLE);
    const extraCount = images.length - MAX_VISIBLE;
    const thumbnails = visibleImages.slice(1);

    return (
        <>
            <Card>
                <CardContent sx={{ pb: '12px !important' }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                        <PhotoLibrary color="primary" fontSize="small" />
                        <Typography fontWeight={600} variant="subtitle2"> Hình ảnh ({images.length}) </Typography>
                    </Stack>

                    <Box
                        onClick={() => setSelected(images[0])}
                        sx={{ width: '100%', height: 160, borderRadius: 1.5, overflow: 'hidden', cursor: 'pointer', mb: thumbnails.length > 0 ? 0.75 : 0, '&:hover img': { transform: 'scale(1.04)', filter: 'brightness(0.88)' }, }}
                    >
                        <Box
                            component="img"
                            src={images[0]}
                            alt="featured-0"
                            loading="lazy"
                            sx={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease, filter 0.3s ease', display: 'block', }}
                        />
                    </Box>

                    {thumbnails.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${thumbnails.length}, 1fr)`, gap: '6px' }}>
                            {thumbnails.map((url, idx) => {
                                const isLast = idx === thumbnails.length - 1;
                                const showOverlay = isLast && extraCount > 0;
                                return (
                                    <Box
                                        key={idx}
                                        onClick={() => showOverlay ? setSelected(images[MAX_VISIBLE]) : setSelected(url)}
                                        sx={{ position: 'relative', height: 90, borderRadius: 1.5, overflow: 'hidden', cursor: 'pointer', '&:hover img': { transform: 'scale(1.06)', filter: showOverlay ? 'none' : 'brightness(0.86)' }, }}
                                    >
                                        <Box
                                            component="img"
                                            src={url}
                                            alt={`featured-${idx + 1}`}
                                            loading="lazy"
                                            sx={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease, filter 0.3s ease', display: 'block', }}
                                        />
                                        {showOverlay && (
                                            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5, transition: 'bgcolor 0.2s', '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' }, }}>
                                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', letterSpacing: 0.5, userSelect: 'none', }}>
                                                    +{extraCount}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {selected && (() => {
                const currentIdx = images.indexOf(selected);
                const hasPrev = currentIdx > 0;
                const hasNext = currentIdx < images.length - 1;
                return (
                    <Box
                        onClick={() => setSelected(null)}
                        sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, }}
                    >
                        <Box
                            onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                            sx={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 300, transition: 'bgcolor 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' }, userSelect: 'none', }}
                        >
                            ✕
                        </Box>
                        <Box
                            onClick={(e) => { e.stopPropagation(); if (hasPrev) setSelected(images[currentIdx - 1]); }}
                            sx={{ position: "absolute", left: { xs: 8, md: 24 }, width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 }, borderRadius: "50%", bgcolor: hasPrev ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: hasPrev ? "pointer" : "default", color: hasPrev ? "#fff" : "rgba(255,255,255,0.25)", transition: "all 0.2s", "&:hover": hasPrev ? { bgcolor: "rgba(255,255,255,0.30)", transform: "scale(1.08)", } : {}, userSelect: "none", }}
                        >
                            <ChevronLeft sx={{ fontSize: { xs: 20, md: 26 }, }} />
                        </Box>
                        <Box
                            onClick={(e) => e.stopPropagation()}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}
                        >
                            <Box
                                component="img"
                                src={selected}
                                loading="lazy"
                                alt="preview"
                                sx={{ maxWidth: '80vw', maxHeight: '82vh', borderRadius: 2, boxShadow: '0 24px 80px rgba(0,0,0,0.6)', objectFit: 'contain', display: 'block', }}
                            />
                        </Box>
                        <Box
                            onClick={(e) => { e.stopPropagation(); if (hasNext) setSelected(images[currentIdx + 1]); }}
                            sx={{ position: "absolute", right: { xs: 8, md: 24 }, width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 }, borderRadius: "50%", bgcolor: hasNext ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: hasNext ? "pointer" : "default", color: hasNext ? "#fff" : "rgba(255,255,255,0.25)", transition: "all 0.2s", "&:hover": hasNext ? { bgcolor: "rgba(255,255,255,0.30)", transform: "scale(1.08)", } : {}, userSelect: "none", }}
                        >
                            <ChevronRight sx={{ fontSize: { xs: 20, md: 26 }, }} />
                        </Box>
                    </Box>
                );
            })()}
        </>
    );
}