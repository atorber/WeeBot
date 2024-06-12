#include <stdio.h>
#include <unistd.h>

int
f (const char * s)
{
  printf ("String: %s\n", s);
  return 0;
}

int
main (int argc,
      char * argv[])
{
  const char * s = "Testing!";

  printf ("f() is at %p\n", f);
  printf ("s is at %p\n", s);

  while (1)
  {
    f (s);
    sleep (1);
  }
}