export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


export const getInitials = (name) =>{
    if(!name) return"";
    const words = name.split(" ");
    let initials = "";
    for(const part of words )
    {
        if(part)
        {
            initials = initials + part[0].toUpperCase();
        }
    }
    return initials;
}