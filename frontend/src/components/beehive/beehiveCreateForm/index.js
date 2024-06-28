import { useEffect } from 'react';
import { Button, CssBaseline, Modal, TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/material";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import getCroppedImg from "@/util/cropImage";
import { DesignServices } from "@mui/icons-material";
import { useRouter } from 'next/router';
import bee from '@/pages/bee/[beeId]';
import beehive from '@/pages/beehive/[beehiveId]';

export default function BeehiveCreateForm() {

    // Beehive information
    const [beehiveId, setBeehiveId] = useState('');
    const [beehiveName, setBeehiveName] = useState('');
    const [description, setDescription] = useState('');
    const [beehiveIcon, setBeehiveIcon] = useState(null);
    const [beehiveHeader, setBeehiveHeader] = useState(null);

    // Icon cropper
    const [currentImage, setCurrentImage] = useState(null);
    const [cropIcon, setCropIcon] = useState({ x: 0, y: 0 });
    const [zoomIcon, setZoomIcon] = useState(1);
    const [croppedAreaPixelsIcon, setCroppedAreaPixelsIcon] = useState(null);
    const [beehiveIconUrl, setBeehiveIconUrl] = useState('');

    // Header cropper
    const [cropHeader, setCropHeader] = useState({ x: 0, y: 0});
    const [zoomHeader, setZoomHeader] = useState(1);
    const [croppedAreaPixelsHeader, setCroppedAreaPixelsHeader] = useState(null);
    const [beehiveHeaderUrl, setBeehiveHeaderUrl] = useState('');

    // Error
    const [beehiveIdError, setBeehiveIdError] = useState(false);
    const [beehiveIdErrorMessage, setBeehiveIdErrorMessage] = useState('');
    const [beehiveNameError, setBeehiveNameError] = useState(false);
    const [beehiveNameErrorMessage, setBeehiveNameErrorMessage] = useState('');

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();

    // Dropzone Icon
    const onDropIcon = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setBeehiveIconUrl(URL.createObjectURL(file));
        setCurrentImage('icon');
        setModalOpen(true);
    },[]);

    // Dropzone Header
    const onDropHeader = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setBeehiveHeaderUrl(URL.createObjectURL(file));
        setCurrentImage('header');
        setModalOpen(true);
    },[]);


    const { getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon, isDragActive:isDragIcon } = useDropzone({ onDrop: onDropIcon });
    const { getRootProps: getRootPropsHeader, getInputProps: getInputPropsHeader, isDragActive: isDragHeader } = useDropzone({ onDrop: onDropHeader });

    const onCropCompleteIcon = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixelsIcon(croppedAreaPixels);
    });

    const onCropCompleteHeader = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixelsHeader(croppedAreaPixels);
    });

    const showCroppedImageIcon = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                beehiveIconUrl,
                croppedAreaPixelsIcon,
            );
            setBeehiveIcon(croppedImage);
            console.log(beehiveIcon);
        } catch (error) {
            console.log(error);
        }
    },[croppedAreaPixelsIcon, zoomIcon]);

    const showCroppedImageHeader = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(beehiveHeaderUrl,croppedAreaPixelsHeader);
            setBeehiveHeader(croppedImage);
            console.log(beehiveHeader);
        } catch (error) {
            console.log(error);
        }
    },[croppedAreaPixelsHeader, zoomHeader]);

    const blobUrlToFile = async (blobUrl, fileName) => {
        const res = await fetch(blobUrl);
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    }

    const checkBeehiveId = async () => {
        const regex = /^[a-zA-Z0-9_]+$/;
        const error = !regex.test(beehiveId)
        setBeehiveIdError(error);
        if(error){
            setBeehiveIdErrorMessage('Please enter beehiveId with only A-Z, a-z, 0-9, _');
        }else{
            setBeehiveIdErrorMessage('');
        }
    }

    const handleCreateBeehive = async () => {
        let error = false;
        if(!beehiveId){
            setBeehiveIdError(true);
            setBeehiveIdErrorMessage('Please enter beehiveId');
            error = true;
        }
        if(!beehiveName){
            setBeehiveNameError(true);
            setBeehiveNameErrorMessage('Please enter beehiveName');
            error = true;
        }

        if(error && beehiveIdError && beehiveNameError) return;

        try {
            const beehiveData = new FormData();
            beehiveData.append('beehiveId', beehiveId);
            beehiveData.append('beehiveName', beehiveName);
            beehiveData.append('description', description);
            if(beehiveIcon) {  
                beehiveData.append('beehiveIcon', await blobUrlToFile(beehiveIcon, 'beehiveIcon.png'));
            }else{
                beehiveData.append('beehiveIcon', null);
            }
            if(beehiveHeader) {
                beehiveData.append('beehiveHeader', await blobUrlToFile(beehiveHeader, 'beehiveHeader.png'));
            }else{
                beehiveData.append('beehiveHeader', null);
            }

            const jwtToken = sessionStorage.getItem('jwtToken');

            axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

            const res = await axios.post('http://localhost:4000/beehive/',beehiveData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            console.log(res);

            if(res.data) {
                const beehiveResponse = res.data.beehive;
                router.push(`/beehive/${beehiveResponse.beehiveId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setIsClient(true);
    },[]);

    useEffect(() => {
        checkBeehiveId();
    },[beehiveId]);

    return (
        <>
            <Container>
                <CssBaseline />
                <Box
                    sx={{
                        justifyContent: "center",
                        flexDirection: "column",
                        display: "flex"
                    }}
                >
                    <TextField
                        label="BeehiveID"
                        error={beehiveIdError}
                        helperText={beehiveIdErrorMessage}
                        value={beehiveId}
                        onChange={(e) => setBeehiveId(e.target.value)}
                        name="beehiveId"
                        required
                        autoFocus
                        sx={{ margin: '10px' }}
                    />
                    <TextField
                        label="BeehiveName"
                        error={beehiveNameError}
                        helperText={beehiveNameErrorMessage}
                        value={beehiveName}
                        onChange={(e) => setBeehiveName(e.target.value)}
                        name="beehiveId"
                        required
                        autoFocus
                        sx={{ margin: '10px' }}
                    />
                    <TextField
                        label="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        name="description"
                        sx={{ margin: '10px' }}
                    />
                    <div>
                        <div style={{ backgroundColor: 'gray', width: '100px', height: '100px', margin: '10px' }}>
                            <div {...getRootPropsIcon()}>
                                <input {...getInputPropsIcon()} />
                                { beehiveIcon ? (
                                    <img src={beehiveIcon} style={{width: '100px', height: '100px'}} id='beehiveIcon' />
                                ) : (
                                    <div style={{ backgroudColor: 'gray', width: '100px', height: '100px'}}>
                                        {isDragIcon ? (
                                            <Typography>Drop the files here ...</Typography>
                                        ) : (
                                            <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'gray', width: '300px', height: '100px', margin: '10px'}}>
                            <div {...getRootPropsHeader()}>
                                <input {...getInputPropsHeader()} />
                                { beehiveHeader ? (
                                    <img src={beehiveHeader} style={{width: '300px', height: '100px'}} id='beehiveHeader'/>
                                ) : (
                                    <div style={{ backgroudColor: 'gray', width: '300px', height: '100px'}}>
                                        {isDragHeader ? (
                                            <Typography>Drop the files here ...</Typography>
                                        ) : (
                                            <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2}} onClick={handleCreateBeehive}>
                        Create Beehive
                    </Button>
                </Box>
            </Container>
            {
                isClient && (
                    <Modal open={modalOpen}>
                        <Box sx={{width: "400px", height: "800px", padding: '5px'}}>
                            <div>
                                {currentImage === 'icon' && beehiveIconUrl && (
                                    <Cropper
                                        image={beehiveIconUrl}
                                        crop={cropIcon}
                                        zoom={zoomIcon}
                                        aspect={1}
                                        onCropChange={setCropIcon}
                                        onCropComplete={onCropCompleteIcon}
                                        onZoomChange={setZoomIcon}
                                    />
                                )}
                                {currentImage === 'header' && beehiveHeaderUrl && (
                                    <Cropper
                                        image={beehiveHeaderUrl}
                                        crop={cropHeader}
                                        zoom={zoomHeader}
                                        aspect={3}
                                        onCropChange={setCropHeader}
                                        onCropComplete={onCropCompleteHeader}
                                        onZoomChange={setZoomHeader}
                                    />
                                )}
                            </div>
                            <Button
                                onClick={async () => {
                                    if(currentImage === 'icon') {
                                        showCroppedImageIcon();
                                    } else if (currentImage === 'header') {
                                        showCroppedImageHeader();
                                    }
                                    setCurrentImage(null);
                                    setModalOpen(false);
                                }}
                            >Acccept</Button>
                        </Box>
                    </Modal>
                )
            }
        </>
    );
}