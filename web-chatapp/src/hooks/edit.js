const createChangeImgHandler =    (supabase, userInfo, setUserInfo, setIsLoading ) =>async (e)=>{
    // send the profile image and get the URL for it
    setIsLoading(1);
    const img = e.target.files?.[0] || null;
    if(!img)
    {
        setIsLoading(0);
        return;
    }
    try {
        const ext = img.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `uploads/${fileName}`;
        // save image
        const { error: uploadError } = await supabase.storage
        .from('ProfileImages')
        .upload(filePath, img);
        if(uploadError)
        {
            throw uploadError;
        }
        // fetch url
        const { data: profileImageData } = supabase.storage
        .from('ProfileImages')
        .getPublicUrl(filePath);
        const imageUrl = profileImageData.publicUrl;
        console.log(imageUrl);
        // modify it
        const { data, error } = await supabase
        .from('user')
        .update({ imageUrl: imageUrl })
        .eq('user_id', userInfo.user_id)
        .select();
        if(error)
        {
            throw error;
        }
        console.log(data);
        setUserInfo(data[0]);
    } catch(error) {
        console.error("error updating profile image", error);
    } finally {
        setIsLoading(0);
    }
}


export {createChangeImgHandler};