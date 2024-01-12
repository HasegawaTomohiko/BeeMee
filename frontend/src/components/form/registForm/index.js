import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Typography, Container, Box, CssBaseline, Grid, Link, Divider, Input, Modal } from '@mui/material';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import getCroppedImg from '../../../util/cropImage';
import { width } from '@mui/system';
import { useRouter } from 'next/router';
import { Cookie } from '@mui/icons-material';
import Cookies from 'js-cookie';

const RegistForm = () => {

    const router = useRouter();
    //form
    const [beeId, setBeeId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [beeName, setBeeName] = useState('');
    const [beeIcon, setBeeIcon] = useState(null);
    const [beeHeader, setBeeHeader] = useState(null);

    //croped image
    const [currentImage, setCurrentImage] = useState(null);
    const [cropIcon, setCropIcon] = useState({ x: 0, y: 0 });
    const [zoomIcon, setZoomIcon] = useState(1);
    const [rotationIcon, setRotaionIcon] = useState(0);
    const [croppedAreaPixelsIcon, setCroppedAreaPixelsIcon] = useState(null);
    const [beeIconUrl, setBeeIconUrl] = useState(null);
    const [cropHeader, setCropHeader] = useState({ x: 0, y: 0 });
    const [zoomHeader, setZoomHeader] = useState(1);
    const [rotationHeader, setRotaionHeader] = useState(0);
    const [croppedAreaPixelsHeader, setCroppedAreaPixelsHeader] = useState(null);
    const [beeHeaderUrl, setBeeHeaderUrl] = useState(null);

    //error
    const [beeIdError, setBeeIdError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [beeNameError, setBeeNameError] = useState(false);

    //modal
    const [modalOpen, setModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const onDropIcon = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setBeeIconUrl(URL.createObjectURL(file));
        setCurrentImage('icon');
        setModalOpen(true);
    },[]);

    const onDropHeader = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setBeeHeaderUrl(URL.createObjectURL(file));
        setCurrentImage('header');
        setModalOpen(true);
    },[]);

    const { getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon, isDragActive: isDragIcon } = useDropzone({ onDrop: onDropIcon });
    const { getRootProps: getRootPropsHeader, getInputProps: getInputPropsHeader, isDragActive: isDragHeader } = useDropzone({ onDrop: onDropHeader });

    const onCropCompleteIcon = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixelsIcon(croppedAreaPixels);
    },[]);

    const onCropCompleteHeader = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixelsHeader(croppedAreaPixels);
    },[]);

    const showCroppedImageIcon = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                beeIconUrl,
                croppedAreaPixelsIcon,
            );
            setBeeIcon(croppedImage);
        } catch (e) {
            console.error(e);
        }
    },[croppedAreaPixelsIcon, zoomIcon]);

    const showCroppedImageHeader = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                beeHeaderUrl,
                croppedAreaPixelsHeader,
            );
            setBeeHeader(croppedImage);
        } catch (e) {
            console.error(e);
        }
    },[croppedAreaPixelsHeader, zoomHeader]);
    
    const handleRegister = async () => {

        if(!beeId || !password || !confirmPassword || !email || !beeName) {
            if(!beeId) setBeeIdError(true);
            if(!password) setPasswordError(true);
            if(!email) setEmailError(true);
            if(!beeName) setBeeNameError(true);
            return;
        }

        try {
            const registData = new FormData();
            registData.append('beeId',beeId);
            registData.append('password',password);
            registData.append('email',email);
            registData.append('beeName',beeName);
            registData.append('beeIcon',beeIcon);
            registData.append('beeHeader',beeHeader);


            const res = await axios.post('http://localhost:4000/bee/',registData);

            console.log(res.data);

            if(res.data) {
                console.log('Created!!!');
                const loginData = {
                    beeId : beeId,
                    password : password
                }
                const loginRes = await axios.post('http://localhost:4000/auth/',loginData);
                const { jwtToken, bee } = loginRes.data;

                console.log(loginRes.data);

                if(res.data.beeId){

                    sessionStorage.setItem('jwtToken', jwtToken);
                    sessionStorage.setItem('beeId', loginRes.data.beeId);

                    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

                    console.log('goto home');

                    router.push('/home');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            if(error.response.status === 400) {
                setBeeIdError(true);
            }
        }
    };

    useEffect(() => {

        setIsClient(true);

        const checkPassword = () => {
            setPasswordError(password !== confirmPassword);
        }

        const checkEmail = () => {
            setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0);
        }

        const checkBeeName = () => {
            setBeeNameError(beeName.length > 30 && beeName.length != 0);
        }

        setBeeIdError(false);
        checkPassword();
        checkEmail();
        checkBeeName();

    },[password, confirmPassword, beeId, email, beeName]);

    return (
        <>
            <Container maxWidth="lg">
                <CssBaseline />
                <Box
                    backgroundColor="orange"
                    borderRadius={10}
                    padding={5}
                    mt={{ xs: 4, md: 4 }}
                    justifyContent="center"
                    display='flex'
                >
                    <Box width={{ xs: '100%', md: '50%'}}>
                        
                        <Typography>
                        Register
                        </Typography>

                        <TextField
                            label="BeeID"
                            value={beeId}
                            error={beeIdError}
                            helperText={beeIdError ? (beeId.length === 0 ? 'Please type BeeID' : 'BeeId already is used') : ''}
                            onChange={(e) => setBeeId(e.target.value)}
                            fullWidth
                            margin="normal"
                            name="identifier"
                            autoFocus
                            InputProps={{
                                style: {
                                    backgroundColor: 'white',
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            error={passwordError}
                            helperText={passwordError ? 'Please type your password' : ''}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: {
                                    backgroundColor: 'white',
                                }
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            error={passwordError}
                            helperText={passwordError ? 'Password is not match' : ''}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: {
                                    backgroundColor: 'white',
                                }
                            }}
                        />
                        <TextField
                            label="Email"
                            type='email'
                            error={emailError}
                            helperText={emailError ? 'Please type your email' : ''}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: {
                                    backgroundColor: 'white',
                                }
                            }}
                        />
                        <Divider/>
                        <Box>
                            <TextField
                                label="Bee Name"
                                value={beeName}
                                helperText={beeNameError ? 'Bee Name must be Length 30' : ''}
                                error={beeNameError}
                                onChange={(e) => setBeeName(e.target.value)}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    style: {
                                        backgroundColor: 'white',
                                    }
                                }}
                            />
                            <div>
                                <div style={{ backgroundColor: 'gray', width: '100px', height: '100px', margin: '10px' }}>
                                    <div {...getRootPropsIcon()}>
                                        <input {...getInputPropsIcon()}/>
                                        { beeIcon ? (
                                            <img src={beeIcon} style={{width: '100px', height: '100px'}} />
                                        ) : (
                                            <div style={{ backgroundColor: 'gray', width: '100px', height: '100px'}}>
                                                {isDragIcon && (
                                                        <Typography>Drop the files here ...</Typography>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div  style={{ backgroundColor: 'gray', width: '300px', height: '100px', margin: '10px'}}>
                                    <div {...getRootPropsHeader()} >
                                        <input {...getInputPropsHeader()}/>
                                        { beeHeader ? (
                                            <img src={beeHeader} style={{width: '300px', height: '100px', margin: '10px'}} />
                                        ) : (
                                            <div style={{ backgroundColor: 'gray', width: '300px', height: '100px'}}>
                                                {isDragHeader && (
                                                    <Typography>Drop the files here ...</Typography>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Box>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} onClick={handleRegister}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
            {isClient && (
                <Modal
                    open={modalOpen}
                >
                    <Box sx={{ width: 400, height: 800, padding : 2}}>
                        <div>
                            {currentImage === 'icon' && beeIconUrl && (
                                <Cropper
                                    image={beeIconUrl}
                                    crop={cropIcon}
                                    zoom={zoomIcon}
                                    aspect={1}
                                    onCropChange={setCropIcon}
                                    onZoomChange={setZoomIcon}
                                    onCropComplete={onCropCompleteIcon}
                                />
                            )}
                            {currentImage === 'header' && beeHeaderUrl && (
                                <Cropper
                                    image={beeHeaderUrl}
                                    crop={cropHeader}
                                    zoom={zoomHeader}
                                    aspect={16 / 9}
                                    onCropChange={setCropHeader}
                                    onZoomChange={setZoomHeader}
                                    onCropComplete={onCropCompleteHeader}
                                />
                            )}
                        </div>
                        <Button onClick={async () => {
                            if(currentImage === 'icon') {
                                showCroppedImageIcon();
                            } else if(currentImage === 'header') {
                                showCroppedImageHeader();
                            }
                            setCurrentImage(null);
                            setModalOpen(false);
                        }}>Accept</Button>
                    </Box>
                </Modal>
            )}
        </>
    );
};

export {RegistForm};
