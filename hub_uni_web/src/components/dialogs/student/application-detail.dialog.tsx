import { Close, LocationOn, CalendarToday, Email, Phone, CheckCircle, HourglassEmpty, Cancel } from "@mui/icons-material";
import { Avatar, Box, Chip, Dialog, DialogContent, Divider, IconButton, Skeleton, Stack, Typography, useMediaQuery, useTheme, } from "@mui/material";
import { useGetApplicationByIdQuery } from "../../../app/features/application.api";
import { formatDate } from "../../../utils/date.utils";
import { ConvertService } from "../../../app/services/convert.service";
import { ApplicationStatus, RecruitPostStatus } from "../../../app/models/enums.model";
const brand = "#f36730";

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null; }) {
    if (!value) return null;
    return (
        <Stack direction="row" spacing={1.5} alignItems="center"> {icon}
            <Box>
                <Typography fontSize={12} color="text.secondary"> {label} </Typography>
                <Typography fontWeight={500}> {value} </Typography>
            </Box>
        </Stack>
    );
}

function LoadingSkeleton() {
    return (
        <Stack spacing={3} p={3}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={56} height={56} />
                <Box flex={1}>
                    <Skeleton width="50%" />
                    <Skeleton width="35%" />
                </Box>
            </Stack>

            <Skeleton height={80} />
            <Skeleton height={80} />
        </Stack>
    );
}

function getStatus(status?: ApplicationStatus) {

    switch (status) {

        case ApplicationStatus.Accepted:
            return (
                <Chip
                    icon={<CheckCircle />}
                    label="Đã duyệt"
                    color="success"
                    size="small"
                />
            );

        case ApplicationStatus.Pending:
            return (
                <Chip
                    icon={<HourglassEmpty />}
                    label="Đang chờ"
                    color="warning"
                    size="small"
                />
            );

        case ApplicationStatus.Rejected:
            return (
                <Chip
                    icon={<Cancel />}
                    label="Từ chối"
                    color="error"
                    size="small"
                />
            );

        case ApplicationStatus.Undefined:
            return (
                <Chip
                    icon={<Cancel />}
                    label="Không xác định"
                    color="default"
                    size="small"
                />
            );
        default:
            return null;
    }
}

interface Props { applicationId: string | null; open: boolean; onClose: () => void; }
export default function ApplicationDetailDialog({ applicationId, open, onClose }: Props) {

    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { data, isLoading, isError } = useGetApplicationByIdQuery(applicationId ?? "", { skip: !applicationId });

    const customer = data?.Customer;
    const post = data?.RecruitmentPost;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3 } }}
        >
            <Box
                px={3}
                py={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderBottom="1px solid #eee"
            >
                <Typography fontWeight={600} fontSize={18}> Chi tiết đơn ứng tuyển </Typography>
                <IconButton onClick={onClose}> <Close /> </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>

                {isLoading && <LoadingSkeleton />}
                {isError && (<Box p={4} textAlign="center"> <Typography color="error"> Không thể tải dữ liệu </Typography> </Box>)}
                {data && (<Stack spacing={3} p={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={customer?.AvatarFullUrl} sx={{ width: 56, height: 56, bgcolor: brand }}>
                            {customer?.FullName?.[0]}
                        </Avatar>

                        <Box>
                            <Typography fontWeight={600}> {customer?.FullName} </Typography>
                            <Typography fontSize={13} color="text.secondary"> {customer?.Email} </Typography>
                        </Box>
                    </Stack>
                    <Divider />
                    <Box>

                        <Typography fontWeight={600} mb={1}> Chương trình ứng tuyển </Typography>
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography fontWeight={500}>
                                    {post?.Name}
                                </Typography>

                                {getStatus(ConvertService.convertApplicationStatusFromString(data?.ApplicationStatus))}
                            </Stack>

                            {post?.Organization?.Name && (<Typography fontSize={13} color="text.secondary"> {post.Organization.Name} </Typography>)}

                            <InfoItem
                                icon={<LocationOn fontSize="small" color="action" />}
                                label="Địa điểm"
                                value={post?.Province}
                            />

                            <InfoItem
                                icon={<CalendarToday fontSize="small" color="action" />}
                                label="Ngày nộp"
                                value={formatDate(data.CreatedAt)}
                            />

                        </Stack>
                    </Box>

                    <Divider />

                    <Box>

                        <Typography fontWeight={600} mb={1}> Thông tin liên hệ </Typography>

                        <Stack spacing={2}>
                            <InfoItem
                                icon={<Email fontSize="small" color="action" />}
                                label="Email"
                                value={customer?.Email}
                            />
                            <InfoItem
                                icon={<Phone fontSize="small" color="action" />}
                                label="Số điện thoại"
                                value={customer?.PhoneNumber}
                            />
                        </Stack>
                    </Box>
                </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}