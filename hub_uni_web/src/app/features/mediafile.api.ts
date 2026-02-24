import baseApi from "./base.api";

interface UploadResponse {
    RelativeUrl: string;
    FullUrl: string;
}

const mediafileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        uploadOneFile: builder.mutation<UploadResponse, File>({
            query: (file) => {
                const formData = new FormData();
                const fileName = file.name
                formData.append(fileName, file);

                return {
                    url: "mediafile/uploadonenoauthen",
                    method: "POST",
                    body: formData,
                };
            }
        }),

        uploadManyFiles: builder.mutation<UploadResponse[], FormData>({
            query: (formData) => {
                return {
                    url: "mediafile/uploadmany",
                    method: "POST",
                    body: formData,
                };
            }
        }),
    }),
});

export const { useUploadOneFileMutation, useUploadManyFilesMutation } = mediafileApi;
export default mediafileApi;